class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.references :retrieval_collection, index: true, foreign_key: true
      t.string :type
      t.text :search_params
      t.string :order_number
      t.string :state
      t.text :order_information

      t.timestamps null: false
    end
  end
end
