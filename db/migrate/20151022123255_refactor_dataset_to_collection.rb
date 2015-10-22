class RefactorDatasetToCollection < ActiveRecord::Migration
  def change
    rename_table :dataset_extras, :collection_extras
    rename_table :recent_datasets, :recent_collections
    rename_column :access_configurations, :dataset_id, :collection_id
  end
end
