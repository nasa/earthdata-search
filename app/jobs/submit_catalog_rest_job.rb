class SubmitCatalogRestJob < ActiveJob::Base
  # Processes a Order object submitting it's data to Catalog REST
  #
  # @param order [Order] the Order object to process
  # @param base_url [String] the base url to provide to the user in their order to check on for status updates
  def perform(order, base_url)
    request_url = "#{base_url}/data/retrieve/#{order.retrieval_collection.retrieval.to_param}"
    shapefile = nil

    if order.search_params.key?('sf') && !order.search_params['sf'].blank?
      shapefile = Shapefile.find(order.search_params['sf'].to_i)
      shapefile = shapefile.nil? ? nil : shapefile.file
      order.search_params.delete('sf')
    end

    order.submit! do
      # Submits the order
      esi_response = ESIClient.submit_esi_request(
        order.retrieval_collection,
        order.search_params,
        request_url,
        order.retrieval_collection.retrieval.token,
        shapefile
      ).body

      parsed_response = MultiXml.parse(esi_response)

      order_id = parsed_response.fetch('agentResponse', {}).fetch('order', {})['orderId']

      order.update_attribute('order_number', order_id)
    end
  end
end
