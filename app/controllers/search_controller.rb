class SearchController < ApplicationController
  before_filter :set_env_session

  respond_to :json

  def extract_filters
    return respond_with empty_nlp_response if ENV['nlp_parser_url'].nil?

    is_immediate_reentered = (params.delete :rerun) == 'true'
    previous_keyword = params.delete :previous_q
    metrics_event('immediate-reenter', keyword: params[:q], previous_keyword: previous_keyword) if is_immediate_reentered
    respond_with TextSearchClient.parse_text(params[:q])
  end

  private

  def empty_nlp_response
    {
      'edscSpatial': nil,
      'edscTemporal': nil,
      'keyword': params[:q]
    }
  end
end
