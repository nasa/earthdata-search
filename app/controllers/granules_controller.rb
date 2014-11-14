class GranulesController < ApplicationController
  respond_to :json

  def create
    catalog_response = echo_client.get_granules(granule_params_for_request(request), token)

    if catalog_response.success?
      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('echo-') || key.start_with?('cmr-')
      end

      render json: catalog_response.body, status: catalog_response.status
    else
      render json: catalog_response.body, status: catalog_response.status
    end
  end

  def show
    response = echo_client.get_granule(params[:id], {}, token)

    if response.success?
      respond_with(GranuleDetailsPresenter.new(response.body.first, params[:id]), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def timeline
    catalog_response = echo_client.post_timeline(granule_params_for_request(request), token)
    render json: catalog_response.body, status: catalog_response.status
  end

  class GranuleUrlStreamer
    def initialize(params, token, url_mapper, echo_client)
      @params = params
      @token = token
      @url_mapper = url_mapper
      @echo_client = echo_client
    end

    def each
      yielded_info = false
      at_end = false
      page = 1
      until at_end
        catalog_response = @echo_client.get_granules(@params.merge(page_num: page), @token)
        at_end = catalog_response.headers['Echo-Cursor-At-End'] == 'true'

        if catalog_response.success?
          granules = catalog_response.body['feed']['entry']

          granules.each do |granule|
            unless yielded_info
              @url_mapper.info_urls_for(granule).each do |url|
                yield url
              end
              yielded_info = true
            end

            @url_mapper.urls_for(granule).each do |url|
              yield url
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
    retrieval = Retrieval.find(request[:project])
    dataset_id = request[:dataset]
    user = current_user
    unless user == retrieval.user
      render file: "#{Rails.root}/public/403.html", status: :forbidden
      return
    end

    project = retrieval.jsondata
    dataset = Array.wrap(project['datasets']).find {|ds| ds['id'] == dataset_id}

    query = Rack::Utils.parse_nested_query(dataset['params'])

    method = dataset['serviceOptions']['accessMethod'].find { |m| m['type'] == 'download' }

    url_mapper = OpendapConfiguration.find(dataset_id)
    url_mapper.apply_subsetting(method['subset'])

    @urls = GranuleUrlStreamer.new(query.merge('page_size' => 2000), token, url_mapper, echo_client)
    render stream: true, layout: false
  end

  private

  def granule_params_for_request(request)
    echo_params = request.request_parameters
    return echo_params unless enable_cmr?
    params = echo_params.dup

    # CMR specific params
    if params["cloud_cover"]
      min = params["cloud_cover"]["min"] || ''
      max = params["cloud_cover"]["max"] || ''
      params["cloud_cover"] = min + ',' + max

      params.delete('cloud_cover') if min.empty? && max.empty?
    end

    params
  end
end
