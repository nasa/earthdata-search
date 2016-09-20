class DropRecentCollections < ActiveRecord::Migration
  def change
    drop_table :recent_datasets
  end
end
