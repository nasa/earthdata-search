class SearchController < ApplicationController

  before_filter :set_env_session

  respond_to :json

  def extract_filters
    isImmediateReentered = (params.delete :rerun) == 'true'
    previousKeyword = params.delete :previous_q
    metrics_event('immediate-reenter', {keyword: params[:q], previous_keyword: previousKeyword}) if isImmediateReentered
    respond_with TextSearchClient.parse_text(params[:q])
  end

end
