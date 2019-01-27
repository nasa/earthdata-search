class SubmitLegacyServicesJob < ActiveJob::Base
  # Processes a Order object submitting it's data to Legacy Services
  #
  # @param order [Order] the Order object to process
  def perform(order)
    client = Echo::Client.client_for_environment('prod', Rails.configuration.services)

    token = order.retrieval_collection.retrieval.token

    order.create_empty_order! do
      # Creates an empty order in legacy services
      @order_id = client.create_empty_order(token)

      order.update_attribute('order_number', @order_id)
    end

    order.add_items! do
      # Provides the granules requested to the order
      client.provide_order_items(@order_id, order.search_params, order.retrieval_collection, token)
    end

    order.add_contact_information! do
      # Provides the user and contact information to the order
      client.provide_user_information(@order_id, order.retrieval_collection, token)
    end

    order.submit! do
      # Submits the order
      client.submit_order(@order_id, token)
    end
  end
end
