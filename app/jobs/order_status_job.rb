class OrderStatusJob < ActiveJob::Base
  # Retrieves current status information for orders submitted from the provided retrieval object
  #
  # @param retrieval_id [int] the id of a Retrieval object to process
  # @param base_url [String] the base url to provide to the user in their order to check on for status updates
  def perform(id, token, cmr_env, attempts)
    retrieval = Retrieval.find_by_id(id)

    echo_client = Echo::Client.client_for_environment(cmr_env, Rails.configuration.services)

    orders = LegacyServicesOrder.joins(retrieval_collection: :retrieval).where(retrievals: { id: id })
    hydrate_orders(orders, echo_client, token)

    service_orders = CatalogRestOrder.joins(retrieval_collection: :retrieval).where(retrievals: { id: id })
    hydrate_service_orders(service_orders, echo_client, token)

    # If there were orders that have status values
    if (orders + service_orders).any?
      # If there are any orders that provide status values any of the orders
      # are in creating or pending state we need to continue asking for updates
      if retrieval.in_progress && !Rails.env.test?
        # The order isn't done processing, continue pinging for updated statuses
        OrderStatusJob.set(wait_until: (Time.zone.now + stall_time(retrieval.created_at))).perform_later(id, token, cmr_env, ((attempts || 0) + 1))
      end
    end
  end

  # Basic backoff for order status jobs
  def stall_time(created_at)
    since_creation = Time.zone.now - created_at

    if since_creation < 20.minutes
      30
    elsif since_creation < 2.hours
      5.minutes
    else
      1.hour
    end
  end

  # Retrieve status information for the provided orders and saves the response to the order
  #
  # @param order_ids [Array<LegacyServicesOrder>] an array of orders to retrieve status information for
  # @param echo_client [String] a client object used to communicate with catalog rest
  # @param token [String] the token to supply to CMR
  def hydrate_orders(orders, echo_client, token)
    return if orders.empty?

    order_ids = orders.map(&:order_number).compact

    # If no order numbers exist yet we've not submitted this order to
    # CMR yet, which means its still in our queue or the order failed to create
    return if order_ids.empty?

    order_response = echo_client.get_orders({ id: order_ids }, token)

    if order_response.success?
      # Iterates over the orders response and indexes the result by the id,
      # resulting in: {"ORDER-GUID-HERE" => { ... }}
      echo_orders = order_response.body.map { |o| o['order'] }.index_by { |o| o['id'] }

      orders.each do |order|
        Array.wrap(order.order_number).each do |order_id|
          echo_order = echo_orders[order_id]

          next unless echo_order

          # Write the order details to the record
          order.update_attribute('order_information', echo_order)
        end
      end
    else
      Rails.logger.info "Error retrieving orders: #{order_response.errors.join('\n')}"

      # Ensure that the delayed job fails
      raise order_response.errors.join('\n')
    end
  end

  # Retrieve status information for the provided orders and saves the response to the order
  #
  # @param order_ids [Array<CatalogRestOrder>] an array of orders to retrieve status information for
  # @param echo_client [String] a client object used to communicate with catalog rest
  # @param token [String] the token to supply to CMR
  def hydrate_service_orders(service_orders, echo_client, token)
    return if service_orders.empty?

    service_order_ids = service_orders.map(&:order_number).compact

    # If no order numbers exist yet we've not submitted this order to
    # CMR yet, which means its still in our queue or the order failed to create
    return if service_order_ids.empty?

    # TODO: We loop through `service_orders` twice here, it seems as though we could be a
    # bit smarter about the way we ask catalog rest for order status information (possibly
    # using group_by `service_order.retrieval_collection.collection_id`)
    service_orders.each do |service_order|
      response_json = get_normalized_esi_response(service_order.retrieval_collection.collection_id, Array.wrap(service_order.order_number), echo_client, token)

      catalog_rest_orders = response_json.map { |o| o['agentResponse'] }.index_by { |o| o['order']['orderId'] }

      service_orders.each do |order|
        Array.wrap(order.order_number).each do |order_id|
          echo_order = catalog_rest_orders[order_id]

          next unless echo_order

          # Write the order details to the record
          order.update_attribute('order_information', echo_order)
        end
      end
    end
  end

  # Catalog REST offers an endpoint to retrieve multiple orders but not all providers support it. This
  # method attempts to use that endpoint and accounts for responses from that endpoint as well as the
  # endpoint that only supports one order at a time.
  #
  # @param collection_id [String] the id of the collection to retrieve order status information from
  # @param order_ids [Array<CatalogRestOrder>] an array of orders to retrieve status information for
  # @param echo_client [String] a client object used to communicate with catalog rest
  # @param token [String] the token to supply to CMR
  def get_normalized_esi_response(collection_id, order_ids, echo_client, token)
    esi_client = ESIClient.new

    # Retrieve the service_url once instead of every time we ping EGI -- this will be the same for
    # any call pertaining to the current collection
    service_url = esi_client.get_service_url(collection_id, echo_client, token)

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
end
