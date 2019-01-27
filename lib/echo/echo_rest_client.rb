module Echo
  class EchoRestClient < BaseClient
    def get_echo_availability
      get('availability.json')
    end

    def create_token(username, password)
      auth = {
        username: username,
        password: password,
        client_id: client_id,
        user_ip_address: '127.0.0.1'
      }

      post('tokens.json', { token: auth }.to_json)
    end

    def get_services(token)
      # tags = get('rest/tags', {token: token, :tag_group_id => 'DATASET'})
      # tags = get('rest/tag_groups')
      # tags = get('rest/tags/', {token: token, :tag_group_id => 'SERVICE-INTERFACE'})
      # tags = get('rest/tags')
      # tags = get('rest/service_entries', {tag_group: 'SERVICE-INTERFACE'})
      # tags = get('rest/service_entries/EA74C60A-CB9F-2659-E558-72F76E1EB236/service_entry_tags')

      # puts JSON.pretty_generate(tags.body)

      # service_entries = Array.wrap(ServiceEntry.all(:params => {:tag_group => "DATASET"}))
      puts 'TODO: EchoClient#get_services(token)'
    end

    def get_data_quality_summary(catalog_item_id, token = nil)
      response = get('data_quality_summary_definitions.json', { 'catalog_item_id' => catalog_item_id }, token_header(token))
      return [] unless response.success?

      results = []
      response.body.each do |r|
        results << get("data_quality_summary_definitions/#{r['reference']['id']}", {}, token_header(token)).body
      end
      results
      # NCR 11014478 will allow this to be only one call to echo-rest
    end

    def get_contact_info(user_id, token)
      get("users/#{user_id}.json", {}, token_header(token))
    end

    def get_phones(user_id, token)
      get("users/#{user_id}/phones.json", {}, token_header(token))
    end

    def general_contact_valid?(contact)
      return false if contact.blank? || contact['phones'].blank? || contact['address'].blank?
      true
    end

    def get_preferences(user_id, token)
      response = get("users/#{user_id}/preferences.json", {}, token_header(token))

      # If no preferences exist, create them
      if response.status == 404
        response = update_preferences(user_id, { preferences: {} }, token)
      end

      response
    end

    def update_preferences(user_id, params, token)
      put("users/#{user_id}/preferences.json", params.to_json, token_header(token))
    end

    def get_current_user(token)
      get('users/current.json', {}, token_header(token))
    end

    def get_echo_user(user_id, token)
      get("users/#{user_id}", {}, token_header(token))
    end

    def get_order_information(item_ids, token)
      post('order_information.json', options_to_item_query(catalog_item_id: item_ids).to_query, token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded'))
    end

    def get_option_definition(id, token)
      get("option_definitions/#{id}.json", {}, token_header(token))
    end

    def get_service_order_information(id, token)
      get('service_option_assignments.json', { catalog_item_id: id }, token_header(token))
    end

    def get_all_service_order_information(token)
      get('service_option_assignments.json', nil, token_header(token))
    end

    def get_service_option_definition(id, token)
      get("service_option_definitions/#{id}.json", {}, token_header(token))
    end

    def get_service_entry(id, token)
      get("service_entries/#{id}.json", {}, token_header(token))
    end

    def get_orders(params, token)
      get('orders.json', params, token_header(token))
    end

    def delete_order(order_id, token)
      delete("orders/#{order_id}", {}, nil, token_header(token))
    end

    def get_option_names(option_def_refs)
      option_def_refs.map { |ref| ref['name'] }
    end

    def create_order(granule_query, retrieval_collection, token)
      # Creates an empty order
      order_id = create_empty_order(token)

      # Provides the granules requested to the order
      order_granules = provide_order_items(order_id, granule_query, retrieval_collection, token)

      # Provides the user and contact information to the order
      provide_user_information(order_id, retrieval_collection, token)

      # Submits the order
      submission_response = submit_order(order_id, token)

      { order_id: order_id, response: submission_response, count: order_granules[:ordered_granules].size, dropped_granules: order_granules[:dropped_granules] }
    end

    def create_empty_order(token)
      order_response = post('orders.json', { order: {} }.to_json, token_header(token))

      if order_response.success?
        Rails.logger.info "Response from ECHO Rest creating an empty order: #{order_response.body.inspect}"

        order_response.body.fetch('order', {})['id']
      else
        Rails.logger.info "[ERROR] Providing an empty order to ECHO Rest: #{order_response.errors.join('\n')}"

        nil
      end
    end

    def provide_order_items(order_id, granule_query, retrieval_collection, token)
      option_id   = retrieval_collection.access_method['id']
      option_name = retrieval_collection.access_method['method']
      
      # Some submissions fail if we don't strip whitespace between tags (MYD29P1N)
      option_model = retrieval_collection.access_method['model']
      option_model = option_model.gsub(/>\s+</, '><').strip if option_model

      # Fetch the granules the user is requesting from CRM
      granule_response = retrieval_collection.client.get_granules(granule_query, token)
      granules = if granule_response.success?
                   granule_response.body['feed']['entry']
                 else
                   Rails.logger.info "[ERROR] Retrieving granules from CMR: #{granule_response.errors.join('\n')}"

                   []
                 end

      granules_by_id = granules.index_by { |g| g['id'] }

      order_info_response = get_order_information(granules.map { |g| g['id'] }, token)
      order_info = if order_info_response.success?
                     Rails.logger.info "Response from ECHO Rest retrieving order information: #{order_info_response.body.inspect}"

                     order_info_response.body
                   else
                     Rails.logger.info "[ERROR] Retrieving order information from ECHO Rest: #{order_info_response.errors.join('\n')}"

                     {}
                   end

      # Drop granules from the order if the selected order option is not one of the supported options by this granule
      order_info_hash = order_info.index_by { |info| info.fetch('order_information', {}).fetch('catalog_item_ref', {})['id'] }

      granule_options = order_info_hash.update(order_info_hash) { |_k, v| get_option_names(v.fetch('order_information', {})['option_definition_refs']) }

      # No granules will be excluded from the order if the order option_name is 'deprecated'
      excluded_granule_ids = option_name == 'Order' ? [] : granule_options.reject { |_k, v| v.include?(option_name) }.keys

      granules = granules_by_id.except(*excluded_granule_ids).values
      dropped_granules = granules_by_id.values_at(*excluded_granule_ids).map { |g| { id: g['id'], name: g['producer_granule_id'].nil? ? g['title'] : g['producer_granule_id'] } }

      common_options = {
        quantity: 1
      }

      unless option_id.nil?
        common_options[:option_selection] = {
          id: option_id,
          option_definition_name: option_name,
          content: option_model
        }
      end

      order_items = granules.map { |g| { order_item: { catalog_item_id: g['id'] }.merge(common_options) } }

      items_response = post("orders/#{order_id}/order_items/bulk_action", order_items.to_json, token_header(token), timeout: 600)

      unless items_response.success?
        # We don't need the response (its a nil body with 201)
        Rails.logger.info "[ERROR] Adding order_items to order `#{order_id}`: #{items_response.errors.join('\n')}"
      end

      { ordered_granules: granules, dropped_granules: dropped_granules }
    end

    def provide_user_information(order_id, retrieval_collection, token)
      user_info = retrieval_collection.order_user_information

      user_info_response = put("orders/#{order_id}/user_information", user_info.to_json, token_header(token))

      if user_info_response.success?
        Rails.logger.info "Response from providing user information to ECHO Rest: #{user_info_response.body.inspect}"

        user_info_response.body.fetch('order', {})['id']
      else
        Rails.logger.info "[ERROR] Providing user information to ECHO Rest: #{user_info_response.errors.join('\n')}"

        nil
      end
    end

    def submit_order(order_id, token)
      submission_response = post("orders/#{order_id}/submit", nil, token_header(token))

      unless submission_response.success?
        Rails.logger.info "[ERROR] Submitting order `#{order_id}`: #{submission_response.errors.join('\n')}"
      end

      submission_response
    end

    protected

    def default_headers
      { 'Client-Id' => client_id, 'Echo-ClientId' => client_id }
    end
  end
end
