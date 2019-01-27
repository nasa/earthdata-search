namespace :orders do
  task count: ['environment'] do
    puts "EDSC Contains #{Retrieval.count} retrieval records."
  end

  task dump: ['environment'] do
    Retrieval.all.sort_by { rand }.slice(0, 20).each do |retrieval|
      puts "Retrieval ##{retrieval.id} belongs to #{retrieval.user_id}"
      puts retrieval.jsondata
      puts
    end
  end

  task process: ['environment'] do
    Retrieval.all.each do |r|
      r.update_attributes(environment: Rails.configuration.cmr_env)

      r.collections.each do |collection|
        access_method = collection.fetch('serviceOptions', {}).fetch('accessMethod', []).first

        params = Rack::Utils.parse_nested_query(collection['params'])

        retrieval_collection = r.retrieval_collections.find_or_create_by(collection_id: collection['id'])

        retrieval_collection.update_attributes(access_method: access_method, granule_params: params)

        Array.wrap(access_method.fetch('order_id', [])).each do |order_id|
          if access_method['type'] == 'order'
            order = LegacyServicesOrder.find_or_create_by(retrieval_collection: retrieval_collection, order_number: order_id)

            order.update_attributes(
              state: 'submitted',
              order_number: order_id,
              search_params: params
            )
          elsif access_method['type'] == 'service'
            order = CatalogRestOrder.find_or_create_by(retrieval_collection: retrieval_collection, order_number: order_id)

            order.update_attributes(
              state: 'submitted',
              order_number: order_id,
              search_params: params
            )
          end
        end
      end
    end
  end
end
