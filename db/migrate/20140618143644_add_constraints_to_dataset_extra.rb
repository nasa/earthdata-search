class AddConstraintsToDatasetExtra < ActiveRecord::Migration
  def change
    add_index :dataset_extras, :echo_id, unique: true
    change_column_null :dataset_extras, :echo_id, false
  end
end
