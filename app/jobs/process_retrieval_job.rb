class ProcessRetrievalJob < ActiveJob::Base
  # Pull any jobs for the specified DAACs into their own queues as to not fill
  # up the default queue with long running jobs
  queue_as do
    retrieval_id = arguments.first

    retrieval = Retrieval.find_by(id: retrieval_id)

    retrieval.determine_queue
  end

  # Processes a Retrieval object creating necessary jobs to submit orders associated with the request
  #
  # @param retrieval_id [int] the id of a Retrieval object to process
  # @param base_url [String] the base url to provide to the user in their order to check on for status updates
  def perform(retrieval_id, base_url, cmr_env)
    # Using find_by because we obfuscate the id of Retrieval and the default
    # `find` method will look for an obfuscated id instead of the raw integer
    retrieval = Retrieval.find_by(id: retrieval_id)

    retrieval.collections.each do |collection_hash|
      # We only allow users to select 1 access method per collection now but the javascript has not been updated
      method = collection_hash.fetch('serviceOptions', {}).fetch('accessMethod', [])[0]

      # TODO: Rather than just 'skipping this collection, notify the user of
      # the error. NOTE that a user should not be able to make this happen
      next if method.blank?

      params = Rack::Utils.parse_nested_query(collection_hash['params'])
      params['temporal'] = params.delete('override_temporal') if params['override_temporal']
      params.reject! { |p| %w(datasource short_name).include?(p) }

      # We'll use RetrievalCollection to separate out each collection within the order
      retrieval_collection = RetrievalCollection.create!(
        retrieval_id: retrieval_id,
        collection_id: collection_hash['id'],
        access_method: method,
        granule_params: params
      )

      # Determines the number of granules requested adjusted for a defined maximum number
      granule_count = retrieval_collection.adjusted_granule_count

      # Split up large orders taking into account the limited granule collection tags
      page_size = retrieval_collection.max_order_size
      page_num  = 0

      until page_num * page_size > granule_count
        page_num += 1

        params[:page_size] = page_size
        params[:page_num]  = page_num

        if method['type'] == 'order'
          # `Stage For Delivery` Access Method
          legacy_services_order = LegacyServicesOrder.create(
            retrieval_collection: retrieval_collection,
            search_params: params
          )

          SubmitLegacyServicesJob.set(queue: queue_name).perform_later(
            legacy_services_order,
            cmr_env
          )
        elsif method['type'] == 'service'
          # `Customize` Access Method

          source = Rack::Utils.parse_nested_query(retrieval.project['source'])
          if source.key?('sf')
            params['sf'] = source['sf']
          end

          catalog_rest_order = CatalogRestOrder.create(
            retrieval_collection: retrieval_collection,
            search_params: params
          )

          SubmitCatalogRestJob.set(queue: queue_name).perform_later(
            catalog_rest_order,
            base_url
          )
        end
      end
    end
  end

  after_perform do |job|
    retrieval_id = job.arguments.first

    # Using find_by because we obfuscate the id of Retrieval and the default
    # `find` method will look for an obfuscated id instead of the raw integer
    retrieval = Retrieval.find_by(id: retrieval_id)

    # After all the orders are submitted, kick off the order status jobs to retrieve updates from their respective services
    OrderStatusJob.set(queue: queue_name).perform_later(retrieval.id, retrieval.token, retrieval.environment)
  end
end
