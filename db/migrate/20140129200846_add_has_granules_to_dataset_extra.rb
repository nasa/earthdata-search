class AddHasGranulesToDatasetExtra < ActiveRecord::Migration
  def change
    add_column :dataset_extras, :has_granules, :boolean
  end
end
