namespace :orders do
  desc 'Outputs the number of retrieval records in the database'
  task count: ['environment'] do
    puts "EDSC Contains #{Retrieval.count} retrieval records."
  end

  desc 'Dumps a specified (defaults to 20) number of Retrieval records to the logs as a pseudo data dump'
  task :dump, [:record_count] => ['environment'] do |task, args|
    args.with_defaults(:record_count => 20)

    Retrieval.all.sort_by { rand }.slice(0, args[:record_count].to_i).each do |retrieval|
      puts "Retrieval ##{retrieval.id} belongs to #{retrieval.user_id}"
      puts retrieval.jsondata
      puts
    end
  end

  desc 'Creates necessary children for Retrieval records created before EDSC-2057'
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

  desc 'Print out minimal information pertaining to Retrieval records based on a Retrieval ID'
  task :details_by_id, [:id] => ['environment'] do |task, args|
    retrieval = Retrieval.find_by_id!(args[:id])

    print_retrieval_details(retrieval)
  rescue ActiveRecord::RecordNotFound => e
    puts "ActiveRecord::RecordNotFound (Couldn't find Retrieval with id #{args[:id]})"
  end

  desc 'Print out minimal information pertaining to Retrieval records based on an obfuscated Retrieval ID'
  task :details_by_obfuscated_id, [:obfuscated_id] => ['environment'] do |task, args|
    retrieval = Retrieval.find(args[:obfuscated_id])

    print_retrieval_details(retrieval)
  rescue ActiveRecord::RecordNotFound => e
    puts "ActiveRecord::RecordNotFound (Couldn't find Retrieval with obfuscated_id #{args[:obfuscated_id]})"
  end

  # Accepts a Retrieval object and prints out minimal information about its child records
  # for the purposes of further triage
  #
  # @param retrieval [Retrieval] the object to get further information about
  def print_retrieval_details(retrieval)
    payload = {
      id: retrieval.id,
      collections: []
    }

    retrieval.retrieval_collections.each do |collection|
      collection_payload = {
        id: collection.id,
        collection_id: collection.collection_id,
        granule_count: collection.granule_count,
        orders: []
      }

      collection.orders.each do |order|
        order_payload = {
          id: order.id,
          order_number: order.order_number,
          state: order.state,
          order_information: order.order_information
        }

        collection_payload[:orders] << order_payload
      end

      payload[:collections] << collection_payload
    end

    puts "Retrieval Details for ##{retrieval.id} (Obsfucated ID ##{retrieval.to_param}): #{payload.to_json}"
  end
end
