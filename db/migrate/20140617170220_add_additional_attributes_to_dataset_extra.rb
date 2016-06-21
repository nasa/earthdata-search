class AddAdditionalAttributesToDatasetExtra < ActiveRecord::Migration
  def change
    add_column :dataset_extras, :searchable_attributes, :text
    add_column :dataset_extras, :orbit, :text
  end
end
