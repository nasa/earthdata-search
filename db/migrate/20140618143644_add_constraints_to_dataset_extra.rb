class AddConstraintsToDatasetExtra < ActiveRecord::Migration
  def change
    grouped = DatasetExtra.all.order('updated_at').group_by(&:echo_id).values
    grouped.each do |duplicates|
      first_one = duplicates.pop # Keep the most recent one
      duplicates.map(&:destroy) # Remove duplicates
    end

    add_index :dataset_extras, :echo_id, unique: true
    change_column_null :dataset_extras, :echo_id, false
  end
end
