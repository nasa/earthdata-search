class DatasetsController < ApplicationController
  respond_to :json

  def index
    response = Echo::Client.get_datasets(to_echo_params(params))

    if response.success?
      results = DatasetExtra.decorate_all(response.body)

      respond_with(results: results, hits: response.headers['echo-hits'].to_i, status: response.status)
    else
      respond_with(response.body, status: response.status)
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
    response = Echo::Client.get_facets

    results = []
    results << ["Campaigns", response.body["campaign_sn"]]
    results << ["Platforms", response.body["platform_sn"]]
    results << ["Instruments", response.body["instrument_sn"]]
    results << ["Sensors", response.body["sensor_sn"]]
    results << ["2D Coordinate Name", response.body["twod_coord_name"]]
    results << ["Category Keyword", response.body["category_keyword"]]
    results << ["Topic Keyword", response.body["topic_keyword"]]
    results << ["Term Keyword", response.body["term_keyword"]]
    results << ["Variable Level 1 Keyword", response.body["variable_level_1_keyword"]]
    results << ["Variable Level 2 Keyword", response.body["variable_level_2_keyword"]]
    results << ["Variable Level 3 Keyword", response.body["variable_level_3_keyword"]]
    results << ["Detailed Variable Keyword", response.body["detailed_variable_keyword"]]
    results << ["Processing Level", response.body["processing_level"]]

    if response.success?
      respond_with(results: results, status: response.status)
    else
      respond_with(response.body, status: response.status)
    end

  private

  # Does application-specific transformations on params to make them
  # suitable for the ECHO client.  Including these in the ECHO client
  # would be inappropriate and make it difficult to distribute the
  # client as a gem
  def to_echo_params(params)
    result = params.dup

    # Remove bits of the keywords param that aren't ECHO keywords, such as placename
    keywords = params[:keywords].presence
    placename = params[:placename].presence
    params[:keywords] = keywords.gsub(placename, '') if keywords && placename

    result
  end
end
