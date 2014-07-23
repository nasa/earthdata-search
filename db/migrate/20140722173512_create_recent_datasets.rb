class CreateRecentDatasets < ActiveRecord::Migration
  def change
    create_table :recent_datasets do |t|
      t.belongs_to :user, index: true
      t.string :echo_id

      t.timestamps
    end
  end
end
