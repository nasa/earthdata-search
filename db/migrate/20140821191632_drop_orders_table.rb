class DropOrdersTable < ActiveRecord::Migration
  def change
    drop_table :orders
  end
end
