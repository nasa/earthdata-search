class AddAbstractionsToRetrievals < ActiveRecord::Migration
  def change
    add_column :retrievals, :token, :string
    add_column :retrievals, :environment, :string
  end
end
