class RenameProjectColumns < ActiveRecord::Migration
  def change
    rename_column :projects, :jsondata, :path
    remove_column :projects, :username, :string
  end
end
