class AddNameToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :name, :string
  end
end
