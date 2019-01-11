class AddProfileFieldsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :urs_profile, :text
    add_column :users, :echo_profile, :text

    rename_column :users, :contact_information, :echo_preferences
  end
end
