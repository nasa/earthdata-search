class GranulesController < ApplicationController
  respond_to :json

  def index
    catalog_response = Echo::Client.get_granules(request.query_parameters, token)

    if catalog_response.success?
      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('echo-')
      end

      respond_with(catalog_response.body, status: catalog_response.status)
    else
      respond_with(catalog_response.body, status: catalog_response.status)
    end
  end

  class GranuleUrlStreamer
    def initialize(params)
      @params = params
    end

    def each
      at_end = false
      page = 1
      until at_end
        catalog_response = Echo::Client.get_granules(@params.merge(page_num: page), token)
        at_end = catalog_response.headers['Echo-Cursor-At-End'] == 'true'

        if catalog_response.success?
          granules = catalog_response.body['feed']['entry']

          granules.each do |granule|
            Array.wrap(granule['links']).each do |link|
              if link['rel'].include?('/data') || link['rel'] == 'enclosure'
                yield link['href']
              end
            end
          end

          page += 1
        else
          @errors = catalog_response.body
          return
        end
      end
    end
  end

  def download
    @urls = GranuleUrlStreamer.new(request.query_parameters)
    render stream: true, layout: false
  end
end
