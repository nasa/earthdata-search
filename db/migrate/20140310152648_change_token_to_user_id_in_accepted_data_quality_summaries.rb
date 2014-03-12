class ChangeTokenToUserIdInAcceptedDataQualitySummaries < ActiveRecord::Migration
  def change
    rename_column :accepted_data_quality_summaries, :token, :user_id
  end
end
