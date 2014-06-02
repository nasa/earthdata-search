class StoreGranulesInDatasetExtras < ActiveRecord::Migration
  def change
    remove_column :dataset_extras, :thumbnail_url, :string
    add_column :dataset_extras, :browseable_granule, :string
    add_column :dataset_extras, :granule, :string
  end
end
