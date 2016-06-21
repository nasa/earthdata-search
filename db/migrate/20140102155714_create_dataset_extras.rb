class CreateDatasetExtras < ActiveRecord::Migration
  def change
    create_table :dataset_extras do |t|
      t.string :echo_id
      t.boolean :has_browseable_granules
      t.string :thumbnail_url

      t.timestamps
    end
  end
end
