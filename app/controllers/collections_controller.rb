class CollectionsController < ApplicationController
  respond_to :json

  around_action :log_execution_time

  UNLOGGED_PARAMS = ['include_facets', 'hierarchical_facets', 'include_tags', 'include_granule_counts']

  def index
    collection_params = collection_params_for_request(request)
    unless params['echo_collection_id']
      metrics_event('search', collection_params.except(*UNLOGGED_PARAMS))
    end
    catalog_response = echo_client.get_collections(collection_params, token)

    if catalog_response.success?
      catalog_response.body['feed']['facets'] = Hash.new if catalog_response.body['feed']['facets'].nil?
      catalog_response.body['feed']['facets']['children'] = add_fake_json_facets(catalog_response.body['feed']['facets'])

      CollectionExtra.decorate_all(catalog_response.body['feed']['entry'])

      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('cmr-')
      end
    end

    respond_with(catalog_response.body, status: catalog_response.status)
  end

  def show
    metrics_event('details', {collections: [params[:id]]})
    response = echo_client.get_collection(params[:id], token)

    use_collection(params[:id])

    if response.success?
      respond_with(CollectionDetailsPresenter.new(response.body.first, params[:id], token, cmr_env), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def use
    metrics_event('view', {collections: [params[:id]]})
    result = use_collection(params[:id])
    render :json => result, status: :ok
  end

  def collection_relevancy
    number_of_collections = 20

    data = {
      query: params[:query],
      collections: params[:collections][0..number_of_collections - 1],
      selected_index: params[:selected_index],
      selected_collection: params[:selected_collection]
    }

    metrics_event('collection_relevancy', data)
    render :json => 'ok', status: :ok
  end

  private

  def collection_params_for_request(request)
    params = request.query_parameters.dup

    params.delete(:portal)
    if portal? && portal[:params]
      params.deep_merge!(portal[:params]) do |key, v1, v2|
        if v1.is_a?(Array) && v2.is_a?(Array)
          v1 + v2
        else
          v2
        end
      end
    end

    test_facets = params.delete(:test_facets)
    if Rails.env.test? && !test_facets
      params = params.except('include_facets')
    end

    features = Hash[Array.wrap(params.delete(:features)).map {|f| [f, true]}]
    if features['Subsetting Services']
      params['tag_key'] = Array.wrap(params['tag_key'])
      params['tag_key'] << "#{Rails.configuration.cmr_tag_namespace}.extra.subset_service*"
    end

    if features['Map Imagery']
      params['tag_key'] = Array.wrap(params['tag_key'])
      params['tag_key'] << "#{Rails.configuration.cmr_tag_namespace}.extra.gibs"
    end

    if features['Near Real Time']
      params = params.merge('collection_data_type' => 'NEAR_REAL_TIME')
    end

    params['include_tags'] = ["#{Rails.configuration.cmr_tag_namespace}.*",
                              "org.ceos.wgiss.cwic.granules.prod"].join(',')

    # params['include_facets'] = 'v2'

    relevancy_param(params)

    params
  end

  # When a collection search has one of these fields:
  #   keyword
  #   platform
  #   instrument
  #   sensor
  #   two_d_coordinate_system_name
  #   science_keywords
  #   project
  #   processing_level_id
  #   data_center
  #   archive_center
  # We should sort collection results by: sort_key[]=has_granules&sort_key[]=score
  # Otherwise, we should sort collection results by: sort_key[]=has_granules&sort_key[]=entry_title
  def relevancy_param(params)
    params[:sort_key] = ['has_granules']
    # sensor, archive_center and two_d_coordinate_system_name were removed from the available facets but it doesn't
    # hurt to list them here though.
    relevancy_capable_fields = [:keyword, :free_text, :platform, :instrument, :sensor, :two_d_coordinate_system_name,
                                :science_keywords, :project, :processing_level_id, :data_center, :archive_center]
    if (params.keys & relevancy_capable_fields.map(&:to_s)).empty?
      params[:sort_key].push 'entry_title'
    else
      params[:sort_key].push 'score'
    end
  end

  def add_fake_json_facets(facets)
    feature_facet = [{'title' => 'Features', 'type' => 'group', 'applied' => false, 'has_children' => true, 'children' => [
        {'title' => 'Map Imagery', 'type' => 'filter', 'applied' => false, 'has_children' => false},
        {'title' => 'Near Real Time', 'type' => 'filter', 'applied' => false, 'has_children' => false},
        {'title' => 'Subsetting Services', 'type' => 'filter', 'applied' => false, 'has_children' => false}]
     }]
    if facets.present? && facets['children']
      feature_facet + facets['children']
    else
      feature_facet
    end
  end

end
