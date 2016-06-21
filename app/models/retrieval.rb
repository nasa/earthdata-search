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

  # Delayed Jobs calls this method to excute an order creation
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

      retrieval.collections.each do |collection|
        params = Rack::Utils.parse_nested_query(collection['params'])
        params.reject! { |p| ['datasource', 'short_name'].include? p }
        params.merge!(page_size: 2000, page_num: 1)

        access_methods = collection['serviceOptions']['accessMethod']
        access_methods.each do |method|
          begin
            if method['type'] == 'order'
              order_response = client.create_order(params,
                                                   method['id'],
                                                   method['method'],
                                                   method['model'],
                                                   user_id,
                                                   token,
                                                   client,
                                                   access_token)
              method[:order_id] = order_response[:order_id]
              method[:dropped_granules] = order_response[:dropped_granules]
              Rails.logger.info "Granules dropped from the order: #{order_response[:dropped_granules].map { |dg| dg[:id] }}"
            elsif method['type'] == 'service'
              request_url = "#{base_url}/data/retrieve/#{retrieval.to_param}"

              method[:collection_id] = collection['id']
              service_response = MultiXml.parse(ESIClient.submit_esi_request(collection['id'], params, method, request_url, client, token).body)
              method[:order_id] = service_response['agentResponse'].nil? ? nil : service_response['agentResponse']['order']['orderId']
              method[:error_code] = service_response['Exception'].nil? ? nil : service_response['Exception']['Code']
              method[:error_message] = service_response['Exception'].nil? ? nil : service_response['Exception']['Message']
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
                method[:error_message] = "Could not submit request for processing. Our operations team has been notified of the problem. Please try again later. To provide us additional details, please click the button below."
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
end
