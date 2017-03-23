class SearchController < ApplicationController

  before_filter :set_env_session

  respond_to :json

  def extract_filters
    consecutiveKeywordQuery = params.delete :rerun
    Rails.logger.info "------- consecutiveKeywordQuery: #{consecutiveKeywordQuery}"
    respond_with TextSearchClient.parse_text(params[:q])
  end

end
