class DatasetsController < CatalogController
  respond_to :json

  def index
    catalog_response = Echo::Client.get_datasets(to_echo_params(request.query_parameters))

    if catalog_response.success?
      DatasetExtra.decorate_all(catalog_response.body['feed']['entry'])

      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('echo-')
      end

      respond_with(catalog_response.body, status: catalog_response.status)
    else
      respond_with(catalog_response.body, status: catalog_response.status)
    end
  end

  def show
    response = Echo::Client.get_dataset(params[:id])

    if response.success?
      respond_with(DatasetDetailsPresenter.new(response.body.first, params[:id]), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def facets
    response = Echo::Client.get_facets(to_echo_params(request.query_parameters))


    if response.success?
      facets = response.body.with_indifferent_access

      results = [facet_response(facets, 'Campaigns', 'campaign_sn', 'campaign[]'),
                 facet_response(facets, 'Platforms', 'platform_sn', 'platform[]'),
                 facet_response(facets, 'Instruments', 'instrument_sn', 'instrument[]'),
                 facet_response(facets, 'Sensors', 'sensor_sn', 'sensor[]'),
                 facet_response(facets, '2D Coordinate Name', 'twod_coord_name', 'two_d_coordinate_system_name[]'),
                 facet_response(facets, 'Category Keyword', 'category_keyword', 'science_keywords[][category]'),
                 facet_response(facets, 'Topic Keyword', 'topic_keyword', 'science_keywords[][topic]'),
                 facet_response(facets, 'Term Keyword', 'term_keyword', 'science_keywords[][term]'),
                 facet_response(facets, 'Variable Level 1 Keyword', 'variable_level_1_keyword', 'science_keywords[][variable_level_1]'),
                 facet_response(facets, 'Variable Level 2 Keyword', 'variable_level_2_keyword', 'science_keywords[][variable_level_2]'),
                 facet_response(facets, 'Variable Level 3 Keyword', 'variable_level_3_keyword', 'science_keywords[][variable_level_3]'),
                 facet_response(facets, 'Detailed Variable Keyword', 'detailed_variable_keyword', 'science_keywords[][detailed_variable]'),
                 facet_response(facets, 'Processing Level', 'processing_level', 'processing_level[]')
                ]

      respond_with(results, status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  private

  def facet_response(facets, name, key, param)
    items = facets[key]
    items.sort_by! {|facet| facet['term']}
    {name: name, param: param, values: items}
  end
end
