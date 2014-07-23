class DatasetsController < ApplicationController
  respond_to :json

  def index
    catalog_response = Echo::Client.get_datasets(request.query_parameters, token)


    if catalog_response.success?
      add_featured_datasets!(request.query_parameters, token, catalog_response.body)

      DatasetExtra.decorate_all(catalog_response.body['feed']['entry'])

      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('echo-')
      end
    end

    respond_with(catalog_response.body, status: catalog_response.status)
  end

  def show
    response = Echo::Client.get_dataset(params[:id], token)

    use_dataset(params[:id])

    if response.success?
      respond_with(DatasetDetailsPresenter.new(response.body.first, params[:id]), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def facets
    response = Echo::Client.get_facets(request.query_parameters, token)

    if response.success?
      # Hash of parameters to values where hashes and arrays in parameter names are not interpreted
      query = request.query_string.gsub('%5B', '[').gsub('%5D', ']').split('&').map {|kv| kv.split('=')}.group_by(&:first)
      facets = response.body.with_indifferent_access

      results = [facet_response(query, facets, 'Campaigns', 'campaign_sn', 'campaign[]'),
                 facet_response(query, facets, 'Platforms', 'platform_sn', 'platform[]'),
                 facet_response(query, facets, 'Instruments', 'instrument_sn', 'instrument[]'),
                 facet_response(query, facets, 'Sensors', 'sensor_sn', 'sensor[]'),
                 facet_response(query, facets, '2D Coordinate Name', 'twod_coord_name', 'two_d_coordinate_system_name[]'),
                 facet_response(query, facets, 'Category Keyword', 'category_keyword', 'science_keywords[0][category][]'),
                 facet_response(query, facets, 'Topic Keyword', 'topic_keyword', 'science_keywords[0][topic][]'),
                 facet_response(query, facets, 'Term Keyword', 'term_keyword', 'science_keywords[0][term][]'),
                 facet_response(query, facets, 'Variable Level 1 Keyword', 'variable_level_1_keyword', 'science_keywords[0][variable_level_1][]'),
                 facet_response(query, facets, 'Variable Level 2 Keyword', 'variable_level_2_keyword', 'science_keywords[0][variable_level_2][]'),
                 facet_response(query, facets, 'Variable Level 3 Keyword', 'variable_level_3_keyword', 'science_keywords[0][variable_level_3][]'),
                 facet_response(query, facets, 'Detailed Variable Keyword', 'detailed_variable_keyword', 'science_keywords[0][detailed_variable][]'),
                 facet_response(query, facets, 'Processing Level', 'processing_level', 'processing_level[]')
                ]

      respond_with(results, status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  private

  def facet_response(query, facets, name, key, param)
    items = facets[key]

    applied = []
    Array.wrap(query[param]).each do |param_term|
      term = param_term.last
      unless items.any? {|item| item['term'] == term}
        applied << {'term' => term, 'count' => 0}
      end
    end

    items += applied

    items.sort_by! {|facet| facet['term']}
    {name: name, param: param, values: items}
  end

  def add_featured_datasets!(base_query, token, base_results)
    featured = []

    featured_ids = DatasetExtra.featured_ids

    if current_user.present?
      recents = current_user.recent_datasets.where('echo_id not in (?)', featured_ids).limit(RECENT_DATASET_COUNT)
      featured_ids += recents.map(&:echo_id)
    else
      featured_and_recent = (featured_ids + Array.wrap(session[:recent_datasets])).uniq
      featured_ids = featured_and_recent.take(featured_ids.size + RECENT_DATASET_COUNT)
    end

    # Only fetch if the user is requesting the first page
    if base_query['page_num'] == "1" && base_query['echo_collection_id'].nil?
      begin
        featured_query = request.query_parameters.merge('echo_collection_id' => featured_ids)
        featured_response = Echo::Client.get_datasets(featured_query, token)
        featured = featured_response.body['feed']['entry'] if featured_response.success?
      rescue => e
        # This shouldn't happen, but on the off-chance it does, retrieving featured datasets shouldn't
        # be allowed to make the whole request fail
        Rails.logger.error("Error getting featured datasets: #{e}\n#{e.backtrace.join("\n")}")
      end
    end

    if featured.present?
      featured.each { |ds| ds[:featured] = true }
      base_results['feed']['entry'].delete_if { |ds| featured_ids.include?(ds['id']) }
      base_results['feed']['entry'].unshift(*featured)
    end

    base_results
  end
end
