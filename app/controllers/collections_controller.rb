class CollectionsController < ApplicationController
  respond_to :json

  UNLOGGED_PARAMS = ['include_facets', 'hierarchical_facets', 'include_tags', 'include_granule_counts']

  def index
    collection_params = collection_params_for_request(request)
    unless params['echo_collection_id']
      metrics_event('search', collection_params.except(*UNLOGGED_PARAMS))
    end
    catalog_response = echo_client.get_collections(collection_params, token)

    if catalog_response.success?
      add_featured_collections!(collection_params, token, catalog_response.body)
      catalog_response.body['feed']['facets'] =
        FacetsPresenter.new(catalog_response.body['feed']['facets'], request.query_string).as_json

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

  private

  def execute_search(hierarchical, non_hierarchical)
    nh_response = nil
    nh_thread = Thread.new do
      nh_response = non_hierarchical.call
    end
    h_response = nil
    h_thread = Thread.new do
      begin
        h_response = hierarchical.call
      rescue => e
      end
    end
    h_thread.join
    nh_thread.join

    # merge
    h_facets = h_response.body['feed']['facets'] if h_response.body['feed'].present?
    nh_facets = nh_response.body['feed']['facets'] if nh_response.body['feed'].present?
    if h_facets.present? && nh_facets.present?
      nh_data_center = nh_facets.select { |facet| facet['field'] == 'data_center' }
      nh_platform = nh_facets.select { |facet| facet['field'] == 'platform' }
      nh_instrument = nh_facets.select { |facet| facet['field'] == 'instrument' }
      h_facets.map! do |facet|
        if facet['field'] == 'data_centers'
          nh_data_center[0]
        elsif facet['field'] == 'platforms'
          nh_platform[0]
        elsif facet['field'] == 'instruments'
          nh_instrument[0]
        else
          facet
        end
      end
    end
    h_response
  end

  def get_featured_ids
    featured_ids = CollectionExtra.featured_ids

    if current_user.present?
      recents = current_user.recent_collections.where('echo_id not in (?)', featured_ids).limit(RECENT_DATASET_COUNT)
      featured_ids += recents.map(&:echo_id)
    else
      featured_and_recent = (featured_ids + Array.wrap(session[:recent_collections])).uniq
      featured_ids = featured_and_recent.take(featured_ids.size + RECENT_DATASET_COUNT)
    end
  end

  def add_featured_collections!(base_query, token, base_results)
    featured = []

    featured_ids = get_featured_ids

    # Only fetch if the user is requesting the first page
    if base_query['page_num'] == "1" && base_query['echo_collection_id'].nil?
      begin
        featured_query = base_query.merge('echo_collection_id' => featured_ids)
        featured_response = echo_client.get_collections(featured_query, token)
        featured = featured_response.body['feed']['entry'] if featured_response.success?
      rescue => e
        # This shouldn't happen, but on the off-chance it does, retrieving featured collections shouldn't
        # be allowed to make the whole request fail
        Rails.logger.error("Error getting featured collections: #{e}\n#{e.backtrace.join("\n")}")
      end
    end

    if base_query['echo_collection_id'].present?
      base_results['feed']['entry'].each do |ds|
        if featured_ids.include?(ds['id'])
          ds[:featured] = true
        end
      end
    elsif featured.present?
      featured.each { |ds| ds[:featured] = true }
      base_results['feed']['entry'].delete_if { |ds| featured_ids.include?(ds['id']) }
      base_results['feed']['entry'].unshift(*featured)
    elsif base_query['echo_collection_id'].present?
      base_results['feed']['entry'].each { |ds| ds[:featured] = featured_ids.include?(ds['id']) }
    end

    base_results
  end

  def collection_params_for_request(request, hierarchical=true)
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
    params['hierarchical_facets'] = 'true' if params['include_facets'] == 'true' && hierarchical

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

end
