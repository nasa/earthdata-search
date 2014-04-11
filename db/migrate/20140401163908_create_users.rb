class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :echo_id
      t.text :site_preferences

      t.timestamps
    end
  end
end
