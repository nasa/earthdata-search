module OrderUtils
  extend ActiveSupport::Concern

  def hydrate_orders(orders)
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

    # Retrieve a status of each order in this request
    order_response = echo_client.get_orders({ id: order_ids }, token)

    if order_response.success?
      # Iterates over the orders response and indexes the result by the id,
      # resulting in: {"ORDER-GUID-HERE" => { ... }}
      echo_orders = order_response.body.map { |o| o['order'] }.index_by { |o| o['id'] }

      orders.each do |order|
        Array.wrap(order['order_id']).each do |order_id|
          echo_order = echo_orders[order_id]

          if echo_order
            order['order_status'] = echo_order['state']
          else
            # echo order_id doesn't exist yet
            order['order_status'] ||= 'creating'
          end
        end
      end
    end
  end

  def get_normalized_esi_response(collection_id, order_ids, echo_client, token)
    esi_client = ESIClient.new

    # Retrieve the service_url once instead of every time we ping EGI -- this will be the same for
    # any call pertaining to the current collection
    service_url = esi_client.get_service_url(collection_id, echo_client, token)
    # service_url = nil

    # Sets the `X-EDSC-REQUEST` header
    header_value = request.referrer && request.referrer.include?('/data/configure') ? '1' : '2'

    # First attempt to retrieve all the orders at once
    multi_response = esi_client.get_multi_esi_request(collection_id, order_ids, echo_client, token, header_value, service_url)

    # If the DAAC doesnt support this endpoint yet a 303 is returned for backward compatibility
    if multi_response.status == 303
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

  def hydrate_service_orders(service_orders)
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
    end
  end
end
