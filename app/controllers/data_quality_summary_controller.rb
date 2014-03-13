class DataQualitySummaryController < ApplicationController
  respond_to :json

  def retrieve
    user_id = get_user_id
    response = Echo::Client.get_data_quality_summary(params[:catalog_item_id], token)
    response.each do |r|
      dqs_id = r["data_quality_summary_definition"]["id"]
      r["accepted"] = AcceptedDataQualitySummary.where(dqs_id: dqs_id, user_id: user_id).first || false
    end

    if response.size > 0
      respond_with response, status: :ok
    else
      respond_with nil, status: nil
    end
  end

  def accept
    user_id = get_user_id
    params["dqs_ids"].each do |dqs_id|
      AcceptedDataQualitySummary.create!({dqs_id: dqs_id, user_id: user_id})
    end

    render json: nil, status: :ok
  end

  private

  def get_user_id
    response = Echo::Client.get_token_info(token).body
    response["token_info"]["user_guid"] if response["token_info"]
  end
end
