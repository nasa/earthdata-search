class CreateColormaps < ActiveRecord::Migration
  def change
    create_table :colormaps do |t|
      t.string :product
      t.string :url
      t.text :jsondata

      t.timestamps null: false
    end
  end
end
