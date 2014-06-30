class CreateAccessConfigurations < ActiveRecord::Migration
  def change
    create_table :access_configurations do |t|
      t.belongs_to :user, index: true
      t.string :dataset_id
      t.text :service_options

      t.timestamps
    end

    remove_column :projects, :username, :string
    add_column :projects, :user_id, :integer, index: true

    add_index :retrievals, :user_id
  end
end
