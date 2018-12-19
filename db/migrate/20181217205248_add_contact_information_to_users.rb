class AddContactInformationToUsers < ActiveRecord::Migration
  def change
    add_column :users, :contact_information, :text
  end
end
