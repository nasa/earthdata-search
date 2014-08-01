module Echo
  # Register custom middleware
  Faraday.register_middleware(:response,
                              :logging => Echo::ClientMiddleware::LoggingMiddleware,
                              :errors => Echo::ClientMiddleware::ErrorsMiddleware,
                              :echo10_datasets => Echo::ClientMiddleware::Echo10DatasetMiddleware,
                              :echo10_granules => Echo::ClientMiddleware::Echo10GranuleMiddleware,
                              :events => Echo::ClientMiddleware::EventMiddleware)

  class Client
    include Echo::QueryTransformations

    CATALOG_URL = ENV['ECHO_ENDPOINT'] || "https://api.echo.nasa.gov"

    def self.get_datasets(options={}, token=nil)
      format = options.delete(:format) || 'json'
      get("/catalog-rest/echo_catalog/datasets.#{format}", options_to_dataset_query(options), token_header(token))
    end

    def self.get_dataset(id, options={}, token=nil)
      get("/catalog-rest/echo_catalog/datasets/#{id}.echo10", {}, token_header(token))
    end

    def self.get_granules(options={}, token=nil)
      options = options.dup
      format = options.delete(:format) || 'json'
      body = options_to_granule_query(options)
      headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      post("/catalog-rest/echo_catalog/granules.#{format}", body.to_query, headers)
    end

    def self.get_granule(id, options={}, token=nil)
      get("/catalog-rest/echo_catalog/granules/#{id}.echo10", {}, token_header(token))
    end

    def self.get_facets(options={}, token=nil)
      # TODO: Remove true after spatial is fixed for facet searches in catalog rest
      get("/catalog-rest/search_facet.json", options_to_facet_query(options), token_header(token))
    end

    def self.get_timeline(options={}, token=nil)
      get('/catalog-rest/echo_catalog/granules/timeline.json', options, token_header(token))
      # TODO: Use the code below instead of the line above once ECHO NCR 11014642 is done.
      #       Don't forget to re-generate fixtures
      #headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      #post('/catalog-rest/echo_catalog/granules/timeline.json', options.to_query, headers)
    end

    def self.get_provider_holdings
      get("/catalog-rest/echo_catalog/provider_holdings.json")
    end

    # def self.get_token_info(token)
    #   get("/echo-rest/tokens/#{token}/token_info.json", {}, token_header(token))
    # end

    def self.get_data_quality_summary(catalog_item_id, token=nil)
      response = get("/echo-rest/data_quality_summary_definitions.json", {'catalog_item_id' => catalog_item_id}, token_header(token))
      results = []
      response.body.each do |r|
        results << get("/echo-rest/data_quality_summary_definitions/#{r["reference"]["id"]}", {}, token_header(token)).body
      end
      results
      # NCR 11014478 will allow this to be only one call to echo-rest
    end

    # def self.get_token(username, password, client_id, ip)
    #   token = {
    #     token:
    #     {
    #       username: username,
    #       password: password,
    #       client_id: client_id,
    #       user_ip_address: ip
    #     }
    #   }
    #   Echo::Response.new(post("/echo-rest/tokens.json", token.to_json))
    #

    # def self.token_expires_soon(token)
    #   get("/echo-rest/tokens/#{token}/expires_soon.json")
    # end

    # def self.create_user(user)
    #   post('/echo-rest/users.json', user.to_json)
    # end

    # def self.username_recall(params)
    #   post('/echo-rest/users/username_recall.json', params.to_json)
    # end
    #
    # def self.password_reset(params)
    #   post('/echo-rest/users/password_reset.json', params.to_json)
    # end

    def self.get_contact_info(user_id, token)
      get("/echo-rest/users/#{user_id}.json", {}, token_header(token))
    end

    def self.get_phones(user_id, token)
      get("/echo-rest/users/#{user_id}/phones.json", {}, token_header(token))
    end

    def self.get_preferences(user_id, token)
      get("/echo-rest/users/#{user_id}/preferences.json", {}, token_header(token))
    end

    def self.update_preferences(user_id, params, token)
      put("/echo-rest/users/#{user_id}/preferences.json", params.to_json, token_header(token))
    end

    def self.get_current_user(token)
      get("/echo-rest/users/current.json", {}, token_header(token))
    end

    # def self.get_user(user_id, token)
    #   get("/echo-rest/users/#{user_id}", {}, token_header(token))
    # end

    def self.get_availability_events
      get('/echo-rest/calendar_events', severity: 'ALERT')
    end

    def self.get_order_information(item_ids, token)
      get('/echo-rest/order_information.json', {catalog_item_id: item_ids}, token_header(token))
    end

    def self.get_option_definition(id)
      get("/echo-rest/option_definitions/#{id}.json")
    end

    def self.get_orders(token)
      get('/echo-rest/orders.json', {}, token_header(token))
    end

    def self.delete_order(order_id, token)
      delete("/echo-rest/orders/#{order_id}", {}, token_header(token))
    end

    def self.create_order(granule_query, option_id, option_name, option_model, user_id, token)
      # For testing without submitting a boatload of orders
      #return {order_id: 1234, count: 2000}
      catalog_response = Echo::Client.get_granules(granule_query, token)
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

   def self.connection
      Thread.current[:edsc_echo_connection] ||= self.build_connection
    end

    private

    def self.token_header(token)
      token.present? ? {'Echo-Token' => "#{token}:#{ Rails.application.secrets.urs_client_id}"} : {}
    end

    def self.request(method, url, params, body, headers)
      faraday_response = connection.send(method, url, params) do |req|
        req.headers['Content-Type'] = 'application/json' unless method == :get
        headers.each do |header, value|
          req.headers[header] = value
        end
        req.body = body if body
      end
      Echo::Response.new(faraday_response)
    end

    def self.get(url, params={}, headers={})
      request(:get, url, params, nil, headers)
    end

    def self.delete(url, params={}, headers={})
      request(:delete, url, params, nil, headers)
    end

    def self.post(url, body, headers={})
      request(:post, url, nil, body, headers)
    end

    def self.put(url, body, headers={})
      request(:put, url, nil, body, headers)
    end

    def self.build_connection
      Faraday.new(:url => CATALOG_URL) do |conn|
        conn.response :logging

        # The order of these handlers is important.  They are run last to first.
        # Our parsers depend on JSON / XML being converted to objects by earlier
        # parsers.
        conn.response :errors, :content_type => /\bjson$/
        conn.response :json, :content_type => /\bjson$/
        conn.response :echo10_granules, :content_type => "application/echo10+xml"
        conn.response :echo10_datasets, :content_type => "application/echo10+xml"
        conn.response :events, :content_type => /\bxml$/
        conn.response :xml, :content_type => /\bxml$/

        conn.adapter  Faraday.default_adapter
      end
    end
  end
end
