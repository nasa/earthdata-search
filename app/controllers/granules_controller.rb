class GranulesController < ApplicationController
  respond_to :json

  def create
    catalog_response = Echo::Client.get_granules(request.request_parameters, token)

    if catalog_response.success?
      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('echo-')
      end

      render json: catalog_response.body, status: catalog_response.status
    else
      render json: catalog_response.body, status: catalog_response.status
    end
  end

  def show
    response = Echo::Client.get_granule(params[:id], token)

    if response.success?
      respond_with(GranuleDetailsPresenter.new(response.body.first, params[:id]), status: response.status)
    else
      response_with(response.body, status: response.status)
    end
  end

  def timeline
    catalog_response = Echo::Client.get_timeline(request.request_parameters, token)
    render json: catalog_response.body, status: catalog_response.status
  end

  class GranuleUrlStreamer
    def initialize(params, token)
      @params = params
      @token = token
    end

    def each
      at_end = false
      page = 1
      until at_end
        catalog_response = Echo::Client.get_granules(@params.merge(page_num: page), @token)
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
    @urls = GranuleUrlStreamer.new(request.query_parameters, token)
    render stream: true, layout: false
  end
end
