class DataQualitySummaryController < ApplicationController
  respond_to :json

  def retrieve
    response = Echo::Client.get_data_quality_summary(params[:catalog_item_id])
    if response && response.body
      respond_with(response.body, status: response.status)
    else
      respond_with(nil, status: nil)
    end
  end
end