class CreateShapefiles < ActiveRecord::Migration
  def change
    create_table :shapefiles do |t|
      t.text :file
      t.string :file_hash
      t.belongs_to :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
