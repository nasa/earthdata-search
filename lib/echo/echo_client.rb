module Echo
  class EchoClient < BaseClient
    def get_provider_holdings
      get("/catalog-rest/echo_catalog/provider_holdings.json")
    end

    def get_data_quality_summary(catalog_item_id, token=nil)
      response = get("/echo-rest/data_quality_summary_definitions.json", {'catalog_item_id' => catalog_item_id}, token_header(token))
      results = []
      response.body.each do |r|
        results << get("/echo-rest/data_quality_summary_definitions/#{r["reference"]["id"]}", {}, token_header(token)).body
      end
      results
      # NCR 11014478 will allow this to be only one call to echo-rest
    end

    def get_contact_info(user_id, token)
      get("/echo-rest/users/#{user_id}.json", {}, token_header(token))
    end

    def get_phones(user_id, token)
      get("/echo-rest/users/#{user_id}/phones.json", {}, token_header(token))
    end

    def get_preferences(user_id, token)
      response = get("/echo-rest/users/#{user_id}/preferences.json", {}, token_header(token))
      if response.status == 404
        response = update_preferences(user_id, {preferences: {}}, token)
      end
      response
    end

    def update_preferences(user_id, params, token)
      put("/echo-rest/users/#{user_id}/preferences.json", params.to_json, token_header(token))
    end

    def get_current_user(token)
      get("/echo-rest/users/current.json", {}, token_header(token))
    end

    def get_user(user_id, token)
      get("/echo-rest/users/#{user_id}", {}, token_header(token))
    end

    def get_availability_events
      get('/echo-rest/calendar_events', severity: 'ALERT')
    end

    def get_order_information(item_ids, token)
      get('/echo-rest/order_information.json', {catalog_item_id: item_ids}, token_header(token))
    end

    def get_option_definition(id)
      get("/echo-rest/option_definitions/#{id}.json")
    end

    def get_service_order_information(id, token)
      get("/echo-rest/service_option_assignments.json", {catalog_item_id: id}, token_header(token))
    end

    def get_service_option_definition(id, token)
      get("/echo-rest/service_option_definitions/#{id}.json", token_header(token))
    end

    def get_service_entry(id, token)
      get("/echo-rest/service_entries/#{id}.json", token_header(token))
    end

    def get_orders(params, token)
      get('/echo-rest/orders.json', params, token_header(token))
    end

    def delete_order(order_id, token)
      delete("/echo-rest/orders/#{order_id}", {}, token_header(token))
    end

    def create_order(granule_query, option_id, option_name, option_model, user_id, token, cmr_client)
      # Some submissions fail if we don't strip whitespace between tags (MYD29P1N)
      option_model = option_model.gsub(/>\s+</,"><").strip() if option_model

      # For testing without submitting a boatload of orders
      #return {order_id: 1234, count: 2000}
      catalog_response = cmr_client.get_granules(granule_query, token)
      granules = catalog_response.body['feed']['entry']

      order_response = post("/echo-rest/orders.json", {order: {}}.to_json, token_header(token))
      id = order_response.body['order']['id']
      Rails.logger.info "Response: #{order_response.body.inspect}"

      common_options = {quantity: 1}
      unless option_id.nil?
        common_options[:option_selection] = {
          id: option_id,
          option_definition_name: option_name,
          content: option_model
        }
      end
      order_items = granules.map {|g| {order_item: {catalog_item_id: g['id']}.merge(common_options)}}
      items_response = post("/echo-rest/orders/#{id}/order_items/bulk_action", order_items.to_json, token_header(token))

      prefs_response = get_preferences(user_id, token)
      user_response = get_user(user_id, token)

      contact = prefs_response.body['preferences']['general_contact']
      user = user_response.body['user']
      user_info = {
        user_information: {
          shipping_contact: contact,
          billing_contact: contact,
          order_contact: contact,
          user_domain: user['user_domain'],
          user_region: user['user_region']
        }
      }
      user_info_response = put("/echo-rest/orders/#{id}/user_information", user_info.to_json, token_header(token))

      submission_response = post("/echo-rest/orders/#{id}/submit", nil, token_header(token))

      Rails.logger.info "Order response: #{order_response.body.inspect}"
      Rails.logger.info "Items response: #{items_response.body.inspect}"
      Rails.logger.info "User info response: #{user_info_response.body.inspect}"
      Rails.logger.info "Submission response: #{submission_response.body.inspect}"

      {order_id: id, response: submission_response, count: granules.size}
    end
  end
end
