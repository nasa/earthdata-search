class SearchController < ApplicationController

  before_filter :set_env_session

  respond_to :json

  def extract_filters
    is_immediate_reentered = (params.delete :rerun) == 'true'
    previous_keyword = params.delete :previous_q
    metrics_event('immediate-reenter', {keyword: params[:q], previous_keyword: previous_keyword}) if is_immediate_reentered
    respond_with TextSearchClient.parse_text(params[:q])
  end

  def stay_in_edsc
    metrics_event('reverb_redirect', 'stay_in_edsc')
    respond_with :nothing
  end

  def back_to_reverb
    metrics_event('reverb_redirect', 'back_to_reverb')
    respond_with :nothing
  end
end
