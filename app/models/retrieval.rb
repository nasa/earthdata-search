require 'securerandom'

class Retrieval < ActiveRecord::Base
  include ActionView::Helpers::TextHelper
  belongs_to :user
  store :jsondata, coder: JSON

  after_save :update_access_configurations

  obfuscate_id spin: 53465485

  def portal
    return @portal if @portal
    if jsondata && jsondata['query']
      query = Rack::Utils.parse_nested_query(jsondata['query'])
      @portal = query['portal'] if Rails.configuration.portals.key?(query['portal'])
    end
    @portal
  end

  def portal_title
    return nil unless portal.present?

    config = Rails.configuration.portals[portal] || {}
    "#{config['title'] || portal.titleize} Portal"
  end

  def path
    prefix = portal ? "/portal/#{portal}" : ""
    "#{prefix}/data/retrieve/#{to_param}"
  end

  def description
    @description ||= jsondata['description']
    unless @description
      collection = self.collections.first
      @description = get_collection_id(collection['id']) if collection

      if @description
        if collections.size > 1
          @description += " and #{pluralize(collections.size - 1, 'other collection')}"
        end
      else
        @description = pluralize(collections.size, 'collection')
      end
      jsondata['description'] = @description
      save!
    end
    @description
  end

  # EDSC-1542 before, enqueue, error, failure, and success are hooks provided by the Delayed_Job gem to allow visibility
  # into its status.
  # Before: Executed just as the work is started
  # Enqueue: Executed right before the job is added to the queue - please note the job does not have an ID at this stage
  # Error: Executed when the work encounters an exception - the work will be retried later, up to three times
  # Failure: Executed when the work has errored with an exception three times in a row - after this, the job is abandoned

  def self.before(job)
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      queued_jobs = DelayedJob.where(failed_at: nil)
      if job.attempts == 0
        logger.info "Delayed Job #{job.id} from the #{job.queue} queue is beginning its work - there are #{queued_jobs.size - 1} orders waiting in line behind it."
      else
        logger.info "Delayed Job #{job.id} from the #{job.queue} queue has begun its work after failing #{job.attempts} time - there are #{queued_jobs.size - 1} orders waiting in line behind it."
      end
    end
  end

  def self.enqueue(job)
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      queued_jobs = DelayedJob.where(failed_at: nil)
      logger.info "A new Delayed Job is being added to the #{job.queue} queue for processing - there are #{queued_jobs.size} orders ahead of this job in the queue."
    end
  end 

  def self.error(job, exception)
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      logger.error "Delayed Job #{job.id} from the #{job.queue} queue has encountered an error during its #{job.attempts + 1} attempt. That error is: #{exception}"
    end
  end

  def self.failure(job)
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      logger.error "Delayed Job #{job.id} from the #{job.queue} queue has failed and will not be retried."
    end
  end

  def self.success(job)
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      logger.info "Delayed Job #{job.id} from the #{job.queue} queue has completed processing."
    end
  end

  # Delayed Jobs calls this method to execute an order creation
  def self.process(id, token, env, base_url, access_token)
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      if Rails.env.test?
        normalizer = VCR::HeaderNormalizer.new('Echo-Token', token + ':' + Rails.configuration.urs_client_id, 'edsc')
        VCR::EDSCConfigurer.register_normalizer(normalizer)
      end
     
      retrieval = Retrieval.find_by_id(id)
      project = retrieval.jsondata
      user_id = retrieval.user.echo_id
      client = Echo::Client.client_for_environment(env, Rails.configuration.services)

      retrieval.collections.each do |collection_hash|
        params = Rack::Utils.parse_nested_query(collection_hash['params'])
        params.reject! { |p| ['datasource', 'short_name'].include? p }

        results_count = get_granule_count(client, params, token)
        results_count = 1000000 if results_count > 1000000

        response = client.get_collections({echo_collection_id: collection_hash['id'], include_tags: "#{Rails.configuration.cmr_tag_namespace}.*"},token)

        collection = nil
        if response.success?
          collections = response.body['feed']['entry']
          collection = collections.first if collections.present?
        end
        access_methods = collection_hash['serviceOptions']['accessMethod']
        access_methods.each do |method|
          page_num = 0
          page_size = 2000
          begin
            if method['type'] == 'order'
              until page_num * page_size > results_count do
                page_num += 1
                params.merge!(page_size: page_size, page_num: page_num)
                page_num = results_count / page_size + 1 if limited_collection?(collection)
                order_response = client.create_order(params,
                                                     method['id'],
                                                     method['method'],
                                                     method['model'],
                                                     user_id,
                                                     token,
                                                     client,
                                                     access_token)
                method[:order_id] ||= []
                method[:order_id] << order_response[:order_id]
                method[:dropped_granules] ||= []
                method[:dropped_granules] += order_response[:dropped_granules]
                Rails.logger.info "Granules dropped from the order: #{order_response[:dropped_granules].map { |dg| dg[:id] }}"
              end
            elsif method['type'] == 'service'
              request_url = "#{base_url}/data/retrieve/#{retrieval.to_param}"
              method[:collection_id] = collection_hash['id']
              Rails.logger.info "Total ESI service granules: #{results_count}."

              until page_num * page_size > results_count do
                page_size = collection['tags']['edsc.limited_collections']['data']['limit'] if limited_collection?(collection)

                page_num += 1
                params.merge!(page_size: page_size, page_num: page_num)

                Rails.logger.info "page_size = #{page_size}, page_num = #{page_num}"
                service_response = MultiXml.parse(ESIClient.submit_esi_request(collection_hash['id'], params, method, request_url, client, token).body)

                order_id = service_response['agentResponse'].nil? ? nil : service_response['agentResponse']['order']['orderId']
                error_code = service_response['Exception'].nil? ? nil : service_response['Exception']['Code']
                error_message = Array.wrap(service_response['Exception'].nil? ? nil : service_response['Exception']['Message'])

                method[:order_id] ||= []
                method[:order_id] << order_id
                method[:error_code] = []
                method[:error_code] << error_code
                method[:error_message] = []
                method[:error_message] << error_message

                # break the loop
                if !Rails.configuration.enable_esi_order_chunking || limited_collection?(collection)
                  Rails.logger.info "Stop submitting ESI requests. enable_esi_order_chunking is set to #{Rails.configuration.enable_esi_order_chunking}. #{collection['id']} is #{limited_collection?(method['id']) ? nil : 'not'} a limited collection."
                  page_num = results_count / page_size + 1
                end
              end
            end
          rescue => e
            tag = SecureRandom.hex(8)
            logger.tagged("retrieval-error") do
              logger.tagged(tag) do
                logger.error "Unable to process access method in retrieval #{id}: #{method.to_json}"
                logger.error e.message
                e.backtrace.each {|l| logger.error "\t#{l}"}
                method[:order_status] = 'failed'
                method[:error_code] = tag
                method[:error_message] = ['Could not submit request for processing. Our operations team has been notified of the problem. Please try again later. To provide us additional details, please click the button below.']
              end
            end
          end
        end
      end
      retrieval.jsondata = project
      retrieval.save!
    end
  rescue => e
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      logger.tagged("retrieval-error") do
        logger.error "Unable to process retrieval #{id}"
        logger.error e.message
        e.backtrace.each {|l| logger.error "\t#{l}"}
      end
    end
    raise e
  end

  def collections
    Array.wrap(self.jsondata['collections'] || self.jsondata['datasets'])
  end

  def source
    self.jsondata['source']
  end

  def project
    self.jsondata.except('datasets').merge('collections' => self.collections)
  end

  def project=(project_json)
    datasets = Array.wrap(project_json['collections'] || project_json['datasets'])
    self.jsondata = project_json.except('collections').merge('datasets' => datasets)
  end

  private

  def self.limited_collection?(collection)
    collection['tags'] && collection['tags']['edsc.limited_collections'] && collection['tags']['edsc.limited_collections']
  end

  def get_collection_id(id)
    result = nil
    client = Echo::Client.client_for_environment(@cmr_env || 'prod', Rails.configuration.services)
    response = client.get_collections(echo_collection_id: [id])
    if response.success?
      entry = response.body['feed']['entry'].first
      result = entry['title'] if entry
    end
    result
  end

  def update_access_configurations
    self.collections.each do |collection|
      if collection.key?('serviceOptions') && collection.key?('id')
        AccessConfiguration.set_default_access_config(self.user, collection['id'], collection['serviceOptions'], collection['form_hashes'])
      end
    end
  end

  def self.get_granule_count(client, params, token)
    result = client.get_granules(params, token)
    result.headers['cmr-hits'].to_i || 0
  end
end
