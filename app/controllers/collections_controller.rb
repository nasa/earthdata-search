class CollectionsController < ApplicationController
  include CollectionParams
  respond_to :json

  around_action :log_execution_time

  UNLOGGED_PARAMS = ['include_facets', 'hierarchical_facets', 'include_tags', 'include_granule_counts']

  def index
    collection_params = collection_params_for_request(request)
    unless params['echo_collection_id']
      metrics_event('search', collection_params.except(*UNLOGGED_PARAMS).merge({user_id: session[:user_id]}))
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
    #TODO make 1_4 configurable (yml + ENV)
    response = echo_client.get_collection(params[:id], token, 'umm_json_v1_9')


    if response.success?
      respond_with(CollectionDetailsPresenterUmmJson.new(response.body, params[:id], token, cmr_env), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def use
    metrics_event('view', {collections: [params[:id]]})
    render :json => result, status: :ok
  end

  def collection_relevancy
    number_of_collections = 20

    data = {
      query: params[:query],
      collections: params[:collections][0..number_of_collections - 1],
      selected_index: params[:selected_index],
      selected_collection: params[:selected_collection],
      exact_match: params[:exact_match]
    }

    metrics_event('collection_relevancy', data)
    render :json => 'ok', status: :ok
  end

  private

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
