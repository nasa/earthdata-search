class GranulesController < ApplicationController
  include GranuleUtils

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
    catalog_response = echo_client.get_cwic_granules(params['short_name'], params['startPage'], params['pageCount'], params['temporal'])
    if catalog_response.success?
      decorate_cwic_granules(catalog_response)
    end
    render json: catalog_response.body, status: catalog_response.status
  end

  def show
    response = echo_client.get_granule(params[:id], {}, token)

    if response.success?
      respond_with(GranuleDetailsPresenter.new(response.body.first, params[:id], token, cmr_env), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def timeline
    catalog_response = echo_client.post_timeline(granule_params_for_request(request), token)
    render json: catalog_response.body, status: catalog_response.status
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

    if query['datasource']
      url_mapper = "#{query['datasource'].capitalize}UrlMapper".constantize.new
    else
      url_mapper = OpendapConfiguration.find(collection_id)
      if url_type == :download
        method = collection['serviceOptions']['accessMethod'].find { |m| m['type'] == 'download' }
        url_mapper.apply_subsetting(method['subset'])
      end
    end

    @urls = "#{query['datasource'].present? ? query['datasource'].capitalize : 'Cmr'}GranuleUrlStreamer".constantize.new(query.merge('page_size' => 2000), token, url_mapper, echo_client, url_type)
    render stream: true, layout: false
  end
end
