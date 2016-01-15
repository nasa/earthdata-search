class GranulesController < ApplicationController
  respond_to :json

  def create
    catalog_response = echo_client.get_granules(granule_params_for_request(request), token)

    if catalog_response.success?
      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('cmr-')
      end

      render json: catalog_response.body, status: catalog_response.status
    else
      render json: catalog_response.body, status: catalog_response.status
    end
  end

  def cwic
    catalog_response = echo_client.get_cwic_granules(params['short_name'])
    if catalog_response.success?
      decorate_cwic_granules(catalog_response)
    end
    render json: catalog_response.body, status: catalog_response.status
  end

  def show
    response = echo_client.get_granule(params[:id], {}, token)

    if response.success?
      respond_with(GranuleDetailsPresenter.new(response.body.first, params[:id], token, echo_env), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def timeline
    catalog_response = echo_client.post_timeline(granule_params_for_request(request), token)
    render json: catalog_response.body, status: catalog_response.status
  end

  class GranuleUrlStreamer
    def initialize(params, token, url_mapper, echo_client, url_type=:download)
      params.reject!{|p| ['datasource', 'short_name'].include? p}
      @params = params
      @token = token
      @url_mapper = url_mapper
      @echo_client = echo_client
      @url_type = url_type
    end

    def each
      yielded_info = false
      at_end = false
      page = 1
      page_size = @params["page_size"]
      until at_end
        catalog_response = @echo_client.get_granules(@params.merge(page_num: page), @token)
        hits = catalog_response.headers['CMR-Hits'].to_i

        if catalog_response.success?
          granules = catalog_response.body['feed']['entry']
          at_end = page_size * page >= hits

          granules.each do |granule|
            unless yielded_info
              @url_mapper.info_urls_for(granule).each do |url|
                yield url
              end
              yielded_info = true
            end

            @url_mapper.send("#{@url_type}_urls_for", granule).each do |url|
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
    collection_id = request[:collection]
    user = current_user
    unless user == retrieval.user
      render file: "#{Rails.root}/public/403.html", status: :forbidden
      return
    end

    project = retrieval.project
    collection = Array.wrap(project['collections']).find {|ds| ds['id'] == collection_id}

    query = Rack::Utils.parse_nested_query(collection['params'])

    url_type = :download
    url_type = :browse if request[:browse] == true || request[:browse] == 'true'

    url_mapper = OpendapConfiguration.find(collection_id)

    if url_type == :download
      method = collection['serviceOptions']['accessMethod'].find { |m| m['type'] == 'download' }
      url_mapper.apply_subsetting(method['subset'])
    end

    @urls = GranuleUrlStreamer.new(query.merge('page_size' => 2000), token, url_mapper, echo_client, url_type)
    render stream: true, layout: false
  end

  private

  def granule_params_for_request(request)
    params = request.request_parameters.dup

    if params["cloud_cover"]
      min = params["cloud_cover"]["min"] || ''
      max = params["cloud_cover"]["max"] || ''
      params["cloud_cover"] = min + ',' + max

      params.delete('cloud_cover') if min.empty? && max.empty?
    end

    params.delete('datasource') if params['datasource']
    params.delete('short_name') if params['short_name']

    params
  end

  def decorate_cwic_granules(response)
    response.body['feed']['entry'].each do |cwic_granule|
      # decorate CWIC granules to make them look like CMR granules
      # Rename 'link' to 'links'
      cwic_granule['links'] = cwic_granule.delete('link')
      # Initialize browse_flag
      cwic_granule['browse_flag'] = false
      cwic_granule['links'].each do |link|
        if link['rel'] == 'icon'
          cwic_granule['browse_flag'] = true
          break
        end
      end
      #TODO other 'translations' here
    end
  end
end
