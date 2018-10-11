require 'securerandom'

class Retrieval < ActiveRecord::Base
  include ActionView::Helpers::TextHelper
  belongs_to :user
  store :jsondata, coder: JSON

  after_save :update_access_configurations

  after_create :log_obfuscation_info

  obfuscate_id spin: 53465485

  before_validation :default_order_status, on: :create

  def default_order_status
    get_orders_by_types(%w(order service)).each do |method|
      # Default to order status to `creating` unless it's already set
      method['order_status'] = 'creating' unless method.key?('order_status')
    end
  end

  def log_obfuscation_info
    Rails.logger.info "Retrieval Object with obfuscated ID of #{to_param} has ID #{id}."
  end

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
      all_queued_jobs = DelayedJob.where(failed_at: nil)
      same_queue_jobs = DelayedJob.where(failed_at: nil).where('queue = ?', job.queue)
      if job.attempts.zero?
        logger.info "Delayed Job #{job.id} from the #{job.queue} queue is beginning its work - there are #{same_queue_jobs.size - 1} orders ahead of it (#{all_queued_jobs.size - 1} total)."
      else
        logger.info "Delayed Job #{job.id} from the #{job.queue} queue has begun its work after failing #{job.attempts} time - there are #{same_queued_jobs.size - 1} orders waiting in line behind it (#{all_queued_jobs.size - 1} total)."
      end
    end
  end

  def self.enqueue(job)
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      all_queued_jobs = DelayedJob.where(failed_at: nil)
      same_queue_jobs = DelayedJob.where(failed_at: nil).where('queue = ?', job.queue)
      logger.info "A new Delayed Job is being added to the #{job.queue} queue for processing - there are #{same_queue_jobs.size} orders ahead of it (#{all_queued_jobs.size} total)."
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
     
      logger.tagged("Processing Retrieval Object #{id}") do
        retrieval = Retrieval.find_by_id(id)
        project = retrieval.jsondata
        user_id = retrieval.user.echo_id
        client = Echo::Client.client_for_environment(env, Rails.configuration.services)

        # Keep track of all access methods so that we can determine if we need order status jobs below
        all_access_methods = []

        retrieval.collections.each do |collection_hash|
          params = Rack::Utils.parse_nested_query(collection_hash['params'])
          params.reject! { |p| ['datasource', 'short_name'].include? p }

          results_count = get_granule_count(client, params, token)
          results_count = 1_000_000 if results_count > 1_000_000

          Rails.logger.info "Granules Ordered: #{results_count}"

          response = client.get_collections({ echo_collection_id: collection_hash['id'], include_tags: "#{Rails.configuration.cmr_tag_namespace}.*" }, token)

          collection = if response.success?
                         collections = response.body['feed']['entry']
                         collection = collections.first if collections.present?
                       else
                         logger.error "[ERROR] Failed to get collection #{collection_hash['id']} from CMR: #{response.errors.join('\n')}"

                         nil
                       end

          access_methods = collection_hash.fetch('serviceOptions', {}).fetch('accessMethod', [])
          access_methods.each do |method|
            # Appends the order type to our running list
            all_access_methods << method['type']

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
                  method[:error_code] ||= []
                  method[:error_message] ||= []

                  order_response_obj = order_response[:response]
                  if order_response_obj.status >= 400
                    method[:error_code] << order_response_obj.status
                    method[:error_message] << order_response_obj.body
                  end

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

                  service_response = begin
                                       esi_response = ESIClient.submit_esi_request(collection_hash['id'], params, method, request_url, client, token).body

                                       Rails.logger.info "ESI Order Response: #{esi_response}"

                                       MultiXml.parse(esi_response)
                                     rescue StandardError => e
                                       Rails.logger.error '[ERROR] Parsing response from ESI:'
                                       Rails.logger.error e.message

                                       e.backtrace.each { |line| Rails.logger.error "\t#{line}" }

                                       # Return an empty hash after logging the parsing error
                                       {
                                         'Exception': {
                                           'Code': 503,
                                           'Message': e.message
                                         }
                                       }
                                     end

                  order_id = service_response.fetch('agentResponse', {}).fetch('order', {})['orderId']
                  method[:order_id] ||= []
                  method[:order_id] << order_id

                  error_code = service_response.fetch('Exception', {})['Code']
                  method[:error_code] ||= []
                  method[:error_code] << error_code unless error_code.blank?

                  error_message = Array.wrap(service_response.fetch('Exception', {})['Message'])
                  method[:error_message] ||= []
                  method[:error_message] << error_message unless error_message.blank?

                  # break the loop
                  if !Rails.configuration.enable_esi_order_chunking || limited_collection?(collection)
                    Rails.logger.info "Stop submitting ESI requests. enable_esi_order_chunking is set to #{Rails.configuration.enable_esi_order_chunking}. #{collection['id']} is #{limited_collection?(method['id']) ? nil : 'not'} a limited collection."
                    page_num = results_count / page_size + 1
                  end
                end
              end
            rescue StandardError => e
              tag = SecureRandom.hex(8)
              logger.tagged('processing-error') do
                logger.tagged(tag) do
                  logger.error "[ERROR] Unable to process access method in retrieval #{id}: #{method.to_json}"
                  logger.error e.message
                  
                  e.backtrace.each { |line| Rails.logger.error "\t#{line}" }
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

        if (all_access_methods & %w(order service)).any?
          # Ensure that there are collections within the order that require status hydration
          Retrieval.delay(queue: retrieval.determine_queue).hydrate_jsondata(id, token, env)
        end
      end # Ends Logging Tag
    end # Ends Logging Tag
  rescue StandardError => e
    logger.tagged("delayed_job version: #{Rails.configuration.version}") do
      logger.tagged("Processing Retrieval Object #{id}") do
        logger.tagged('processing-error') do
          logger.error "[ERROR] Attempting to Submit Order #{id}"
          logger.error e.message

          e.backtrace.each { |line| Rails.logger.error "\t#{line}" }
        end
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

  # Certain DAACs have their own queues for large order processing which is determined by
  # examining the collections within the order. If any of the collection are for one of the
  # specified DAACs then the order is placed in the respective queue
  def determine_queue
    daacs = %w(NSIDC LPDAAC)

    daacs.each do |daac|
      collections.each do |collection|
        return daac if collection['id'].include?(daac)
      end
    end

    'Default'
  end

  # Pull out the order data from the objects jsondata by the provided type
  def get_orders_by_type(order_type)
    collections.map do |collection|
      collection.fetch('serviceOptions', {}).fetch('accessMethod', []).select { |m| m['type'] == order_type }
    end.flatten.compact
  end

  # Pull out the order data from the objects jsondata by the provided types
  def get_orders_by_types(order_types)
    collections.map do |collection|
      collection.fetch('serviceOptions', {}).fetch('accessMethod', []).select { |m| order_types.include?(m['type']) }
    end.flatten.compact
  end

  # Return a list of all collection level order statues for the object
  def order_statuses
    collections.map do |collection|
      collection.fetch('serviceOptions', {}).fetch('accessMethod', []).map { |method| method['order_status'] }
    end.flatten.compact
  end

  # Return a list of all order statues for each individual for the object
  def all_order_statuses
    collections.map do |d|
      d.fetch('serviceOptions', {}).fetch('accessMethod', []).map do |m|
        m.fetch('service_options', {}).fetch('orders', []).map do |o|
          o['order_status']
        end
      end
    end.flatten.compact
  end

  # Returns whether or not the retrieval is still processing any of it's orders
  def in_progress
    order_statuses.any? && (order_statuses.map(&:downcase) & ['creating', 'in progress', 'not_validated', 'validated', 'quoting', 'quoted', 'quoted_with_exceptions', 'submitting', 'submitted_with_exceptions', 'processing', 'processing_with_exceptions', 'cancelling']).any?
  end

  class << self
    # Called when orders are created to populate the project jsondata with up to date status information
    def hydrate_jsondata(id, token, cmr_env)
      logger.tagged("delayed_job version: #{Rails.configuration.version}") do
        logger.tagged("Getting Status for Retrieval Object #{id}") do
          # Time the operation to determine how long to stall the next job
          started_at = Time.now

          retrieval = Retrieval.find_by_id(id)

          # Retrieve a status of each order in this request
          echo_client = Echo::Client.client_for_environment(cmr_env, Rails.configuration.services)

          orders = retrieval.get_orders_by_type('order')

          # Retrieve status information about each order within this
          # request and hydrate the objects with necessary data
          Retrieval.hydrate_orders(orders, echo_client, token)

          service_orders = retrieval.get_orders_by_type('service')

          # Retrieve status information about each order within this
          # request and hydrate the objects with necessary data
          Retrieval.hydrate_service_orders(service_orders, echo_client, token)

          # If there were orders that have status values
          if (orders + service_orders).any?
            # Save the Retrieval object after the status information has been retrieved
            retrieval.save

            # End the timer to determine the period of time to stall before our next attempt
            ended_at = Time.now

            # Duration of the execution in seconds
            elapsed_seconds = (ended_at - started_at).to_i

            # Normalize the refresh time between fast and slow jobs by having fast jobs wait.
            # If the job only takes 2 seconds, we'll stall for 28 seconds so were not asking
            # for an update too often.
            stall_time = 30 - [30, elapsed_seconds].min

            # If there are any orders that provide status values any of the orders
            # are in creating or pending state we need to continue asking for updates
            if retrieval.in_progress && !Rails.env.test?
              # The order isn't done processing, continue pinging for updated statuses
              Retrieval.delay(queue: retrieval.determine_queue, run_at: (Time.now + stall_time)).hydrate_jsondata(id, token, cmr_env)
            end
          end
        end
      end
    rescue StandardError => e
      logger.tagged("delayed_job version: #{Rails.configuration.version}") do
        logger.tagged("Getting Status for Retrieval Object #{id}") do
          logger.tagged('retrieval-error') do
            logger.error "[ERROR] Attempting to Submit Order #{id}"
            logger.error e.message

            e.backtrace.each { |line| Rails.logger.error "\t#{line}" }
          end
        end
      end
      raise e
    end

    def hydrate_orders(orders, echo_client, token)
      return if orders.empty?

      order_ids = orders.map { |o| o['order_id'] }.flatten.compact

      # If no order numbers exist yet we've not submitted this order to
      # CMR yet, which means its still in our queue
      if order_ids.empty?
        orders.each do |order|
          order['order_status'] ||= 'creating'
        end

        return
      end

      order_response = echo_client.get_orders({ id: order_ids }, token)

      if order_response.success?
        # Iterates over the orders response and indexes the result by the id,
        # resulting in: {"ORDER-GUID-HERE" => { ... }}
        echo_orders = order_response.body.map { |o| o['order'] }.index_by { |o| o['id'] }

        orders.each do |order|
          order['order_status'] ||= 'creating'

          order['service_options'] = {
            'orders': []
          }

          Array.wrap(order['order_id']).each do |order_id|
            echo_order = echo_orders[order_id]

            next unless echo_order

            # If there is an order provide its status instead of the default `creating`
            order['order_status'] = echo_order['state']

            # Write the order details to the json
            order['service_options']['orders'] << echo_order
          end
        end
      else
        Rails.logger.info "Error retrieving orders: #{order_response.errors.join('\n')}"

        # Ensure that the delayed job fails
        raise order_response.errors.join('\n')
      end
    end

    def get_normalized_esi_response(collection_id, order_ids, echo_client, token)
      esi_client = ESIClient.new

      # Retrieve the service_url once instead of every time we ping EGI -- this will be the same for
      # any call pertaining to the current collection
      service_url = esi_client.get_service_url(collection_id, echo_client, token)
      # service_url = nil

      # Sets the `X-EDSC-REQUEST` header
      header_value = '1'

      # First attempt to retrieve all the orders at once
      multi_response = esi_client.get_multi_esi_request(collection_id, order_ids, echo_client, token, header_value, service_url)

      if multi_response.status >= 400

        Rails.logger.info "Error retrieving order status from ESI: #{multi_response.body}"
        [{
          'Exception' => {
            'Code'    => multi_response.status,
            'Message' => multi_response.body
          }
        }]
      elsif multi_response.status == 303
        # Make individual calls for those that dont support the multi order endpoint
        order_ids.map do |order_id|
          response = esi_client.get_esi_request(collection_id, order_id, echo_client, token, header_value, service_url)

          if response.status == 201
            MultiXml.parse(response.body)
          else
            # EGI doesn't return appropriate error codes so we'll normalize the response here
            {
              'Exception' => {
                'Code'    => response.status,
                'Message' => response.body
              }
            }
          end
        end
      else
        multi_response = MultiXml.parse(multi_response.body)

        # If the entire request fails
        if multi_response['Exception']
          # If the response is an error, just return it as is
          multi_response
        else
          # We have to do a bit of hydration here on the response in order to make
          # it look like the pre-existing response.
          successful_responses = multi_response.fetch('agentMultiResponse', {}).fetch('agentResponse', {})
          successes = Array.wrap(successful_responses).map do |valid_multi_response|
            { 'agentResponse' => valid_multi_response }
          end unless successful_responses.empty?

          # We have to take into account the possibility of one or more orders failing
          failed_responses = multi_response.fetch('agentMultiResponse', {}).fetch('Exception', {})
          errors = Array.wrap(failed_responses).map do |invalid_multi_response|
            { 'Exception' => invalid_multi_response }
          end unless failed_responses.empty?

          # Return both cases and we'll handle them below
          (successes || []) + (errors || [])
        end
      end
    end

    def hydrate_service_orders(service_orders, echo_client, token)
      return if service_orders.empty?

      service_orders.each do |s|
        s['order_status'] = 'creating'

        s['service_options'] = {
          'total_orders': 0,      # Number of total orders within the collection
          'total_complete': 0,    # Number of orders that have completed processing
          'total_number': 0,      # Total number of granules across all orders
          'total_processed': 0,   # Total number of granules processed
          'download_urls': {},    # List of download urls by order id
          'orders': []            # Specific information pertaining to each order
        }

        # The order failed, no need to continue processing
        if (s['error_code'].is_a? String) || s['error_code'].present? && !s['error_code'].compact.empty?
          s['order_status'] = 'failed'

          next
        end

        next unless s['collection_id']

        response_json = get_normalized_esi_response(s['collection_id'], Array.wrap(s['order_id']), echo_client, token)

        # Sets the total order number based on how many came back from ESI
        s['service_options']['total_orders'] += response_json.length

        # Iterate through each order returned from ESI
        response_json.each do |order_response|
          service_order = {
            'download_urls': []
          }

          # If an appropriate response was received
          if order_response['agentResponse']

            order_id = order_response['agentResponse']['order']['orderId']
            service_order['order_id'] = order_id

            # Shortcuts for each of the high level keys
            status = order_response['agentResponse']['requestStatus']
            service_order['total_number'] = status['totalNumber'].to_i
            service_order['total_processed'] = status['numberProcessed'].to_i

            # Contact information for any issues related to the order
            contact = order_response['agentResponse']['contactInformation']
            service_order['contact'] = {
              'name' => contact['contactName'],
              'email' => contact['contactEmail']
            }

            s['service_options']['total_number'] += status['totalNumber'].to_i
            s['service_options']['total_processed'] += status['numberProcessed'].to_i
            s['service_options']['total_complete'] += (status['totalNumber'].to_i == status['numberProcessed'].to_i ? 1 : 0)

            process_info = order_response['agentResponse']['processInfo']

            if order_response['agentResponse']['downloadUrls']
              urls = Array.wrap(order_response['agentResponse']['downloadUrls']['downloadUrl'])
              s['service_options']['download_urls'][order_id] = urls
              service_order['download_urls'] = urls
            end
          else
            status = { 'status' => 'failed' }

            service_order['error_code'] = order_response['Exception']['Code']
            service_order['error_message'] = order_response['Exception']['Message']
          end

          s['order_status'] = status['status']

          if s['order_status'] == 'failed' && order_response['Exception'].nil? && !process_info.nil?
            s['error_message'] = Array.wrap(process_info['message'])
            s['error_code'] = 'Error Code Not Provided'
          end

          service_order['order_status'] = status['status']
          s['service_options']['orders'] << service_order
        end
        
        s['order_status'] = 'in progress' unless s['service_options']['orders'].any? { |o| o['order_status'] == 'creating' }
        s['order_status'] = 'failed' if s['service_options']['orders'].all? { |o| o['order_status'] == 'failed' }
        s['order_status'] = 'complete' if s['service_options']['orders'].all? { |o| o['order_status'] == 'complete' || o['order_status'] == 'complete_with_errors' }
      end
    end
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

    if result.success?    
      result.headers['cmr-hits'].to_i || 0
    else
      logger.error "Failed to get granules from CMR with params: #{params}\n\n#{result.errors.join('\n')}"

      0
    end
  end
end
