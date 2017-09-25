class SearchController < ApplicationController

  before_filter :set_env_session

  respond_to :json

  def extract_filters
    is_immediate_reentered = (params.delete :rerun) == 'true'
    previous_keyword = params.delete :previous_q
    metrics_event('immediate-reenter', {keyword: params[:q], previous_keyword: previous_keyword}) if is_immediate_reentered
    respond_with TextSearchClient.parse_text(params[:q])
  end

  def metrics_event
    Rails.logger.info "We made it!"
    type = params[:type]
    data = params[:data]
    other_data = params[:other_data]
    metrics_event(type, data, other_data)
    # this response makes no sense I'm sure - just trying to get something that doesn't error out
    respond_with(Rails.logger.info params.inspect, status: :ok)
  end
end
