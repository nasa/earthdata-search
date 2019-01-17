class GranulesController < ApplicationController
  include GranuleUtils
  include VariableUtils

  around_action :log_execution_time

  respond_to :json

  def create
    granule_params = granule_params_for_request(request)
    catalog_response = echo_client.get_granules(granule_params, token)
    metrics_event('filter', granule_params)

    if catalog_response.success?
      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('cmr-')
      end
    end

    render json: catalog_response.body, status: catalog_response.status
  end

  def show
    response = echo_client.get_granule(params[:id], {}, token)

    if response.success?
      respond_with(GranuleDetailsPresenterEcho10.new(response.body.first, params[:id], token, cmr_env), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def timeline
    catalog_response = echo_client.post_timeline(granule_params_for_request(request, true), token)

    render json: catalog_response.body, status: catalog_response.status
  end

  def set_ous_root
    # Set the urs root for the download scripts to the appropriate URS environment
    @urs_root = Rails.configuration.services['earthdata'][cmr_env]['urs_root'].sub(/^https?\:\/\//,'')
  end

  # Action rendered with for the HTML view
  def opendap_urls
    @collection = params[:collection]
    @project = params[:project]

    ous_response = fetch_ous_response(params)

    # Prevent the user from having to type their earthdata username if they use the download script
    @user = earthdata_username

    set_ous_root

    # To properly construct the download script we need the
    # first link to ping and ensure its accessible
    # ----
    # NOTE: We strip off any query params from this link because this variable
    # is only used to ensure the endpoint works and certain characters in OPeNDAP
    # land cause errors to be displayed on the screen. We only care that the host
    # responds, the parameters are not important.
    @first_link = ous_response.fetch('items', []).first[/[^@?]+/]

    if request.format == :text || request.format == 'html'
      render 'opendap_urls.html', layout: false
    else
      render 'prepare_opendap_script.html.erb', layout: false
    end
  end

  # JSON Endpoint for `opendap_urls` view
  def fetch_opendap_urls
    ous_response = fetch_ous_response(params)

    # TODO: Render errors after OUS is moved to CMR and supports error responses
    render json: ous_response.fetch('items', []), layout: false
  end

  def fetch_links
    retrieval = Retrieval.find(request[:project])
    collection_id = params[:collection]
    user = current_user
    unless user == retrieval.user
      render file: "#{Rails.root}/public/403.html", status: :forbidden
      return
    end

    page_num = params.delete('page_num') || 1
    browse_only = params.delete('browse')
    url_type = 'download'
    url_type = 'browse' if browse_only == true || browse_only == 'true'

    project = retrieval.project
    collection = Array.wrap(project['collections']).find { |ds| ds['id'] == collection_id }

    query = Rack::Utils.parse_nested_query(collection['params'])
    catalog_response = echo_client.get_granules(query.merge(page_num: page_num, page_size: 2000, format: :json), token)

    if catalog_response.success?
      hits = catalog_response.headers['CMR-Hits'].to_i
      granules = catalog_response.body['feed']['entry']
      url_mapper = OpendapConfiguration.find(collection_id, echo_client, token)
      if url_type == 'download'
        method = collection['serviceOptions']['accessMethod'].find { |m| m['type'] == 'download' }
        url_mapper.apply_subsetting(method['subset'])
      end

      fetched_links = []
      fetched_info = false

      granules.each do |granule|
        unless fetched_info
          url_mapper.info_urls_for(granule).each do |url|
            fetched_links << url
          end
          fetched_info = true
        end

        url_mapper.send("#{url_type}_urls_for", granule).each do |url|
          fetched_links << url
        end
      end
      if request.format == 'text/plain'
        return fetched_links.join("\n")
      else
        # Set custom header causes local rails server to throw 'socket hang up' error.
        # response.headers['CMR-Hits'] = hits
        response_body = {}
        response_body['CMR-Hits'] = hits
        response_body['links'] = fetched_links
        render json: response_body, status: catalog_response.status
      end
    else
      render json: catalog_response.body, status: catalog_response.status
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
    page_num = params.delete('page_num') || 1
    @query = query.merge({'project' => request[:project], 'page_num' => page_num, 'page_size' => 2000, 'browse' => (url_type.to_s == 'browse'), 'collection' => collection_id})

    url_mapper = OpendapConfiguration.find(collection_id, echo_client, token)

    if url_type == :download
      method = collection['serviceOptions']['accessMethod'].find { |m| m['type'] == 'download' }
      url_mapper.apply_subsetting(method['subset'])
    end

    set_ous_root

    @first_link = first_link(Rack::Utils.parse_nested_query(collection['params']), echo_client, token, url_mapper, url_type)

    @user = earthdata_username
    if request.format == :text || request.format == 'html'
      render 'download_links.html.erb', layout:false
    else
      render 'prepare_script.html.erb', layout: false
    end
  end

  private

  def first_link(param, echo_client, token, url_mapper, url_type)
    catalog_response = echo_client.get_granules(param.merge(page_num: 1), token)
    if catalog_response.success?
      granules = catalog_response.body['feed']['entry']

      granules.each do |granule|
        first_info = url_mapper.info_urls_for(granule).first
        return first_info if first_info
      end
      url_mapper.send("#{url_type}_urls_for", granules.first).first
    else
      @errors = catalog_response.body
      nil
    end
  end
end
