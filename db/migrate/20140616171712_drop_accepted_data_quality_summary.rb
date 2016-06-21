class DropAcceptedDataQualitySummary < ActiveRecord::Migration
  def change
    drop_table :accepted_data_quality_summaries do |t|
      t.string :dqs_id
      t.string :token

      t.timestamps
    end
  end
end
