class SubmitCatalogRestJob < OrderJob
  # Processes a Order object submitting it's data to Catalog REST
  #
  # @param order [Order] the Order object to process
  # @param base_url [String] the base url to provide to the user in their order to check on for status updates
  def perform(order, base_url, check_status = false)
    request_url = "#{base_url}/data/retrieve/#{order.retrieval_collection.retrieval.to_param}"
    shapefile = nil

    if order.search_params.key?('sf') && !order.search_params['sf'].blank?
      shapefile = Shapefile.find(order.search_params['sf'].to_i)
      shapefile = shapefile.nil? ? nil : shapefile.file
      order.search_params.delete('sf')
    end

    order.submit! do
      Rails.logger.tagged(order.logging_tag) do
        # Submits the order
        esi_response = ESIClient.submit_esi_request(
          order.retrieval_collection,
          order.search_params,
          request_url,
          order.retrieval_collection.retrieval.token,
          shapefile
        )

        begin
          if esi_response.success?
            begin
              parsed_response = MultiXml.parse(esi_response.body)

              order_id = parsed_response.fetch('agentResponse', {}).fetch('order', {})['orderId']

              order.update_attribute('order_number', order_id)
            rescue MultiXml::ParseError => e
              Rails.logger.error e
            end
          else
            begin
              # Errors seem to come back from a non SDPS service and are in HTML
              failed_response = {
                order: {
                  orderId: '',
                  Instructions: 'This order failed to create.'
                },
                contactInformation: {
                  contactName: 'Earthdata Search Support',
                  contactEmail: 'edsc-support@earthdata.nasa.gov'
                },
                processInfo: {
                  message: Nokogiri::HTML(esi_response.body).text
                },
                requestStatus: {
                  status: 'failed',
                  numberProcessed: '0',
                  totalNumber: '0'
                },
                type: 'eesi:Response-Type'
              }

              order.update_attribute('order_information', failed_response)
            rescue => e
              Rails.logger.error e
            end
          end
        rescue => e
          errored_response = {
            order: {
              orderId: '',
              Instructions: 'This order failed to create.'
            },
            contactInformation: {
              contactName: 'Earthdata Search Support',
              contactEmail: 'edsc-support@earthdata.nasa.gov'
            },
            processInfo: {
              message: e
            },
            requestStatus: {
              status: 'failed',
              numberProcessed: '0',
              totalNumber: '0'
            },
            type: 'eesi:Response-Type'
          }

          order.update_attribute('order_information', errored_response)
        end
      end
    end
  end
end
