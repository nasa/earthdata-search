class DataQualitySummaryController < ApplicationController
  respond_to :json

  def retrieve
    response = Echo::Client.get_data_quality_summary(params[:catalog_item_id], token)
    if response && response.body
      dqs_id = response.body["data_quality_summary_definition"]["id"]
      response.body["accepted"] = AcceptedDataQualitySummary.where(dqs_id: dqs_id, token: token).first || false

      respond_with(response.body, status: response.status)
    else
      respond_with(nil, status: nil)
    end
  end

  def accept
    params["dqs_ids"].each do |dqs_id|
      AcceptedDataQualitySummary.create!({dqs_id: dqs_id, token: token})
    end

    render json: nil, status: :ok
  end
end
