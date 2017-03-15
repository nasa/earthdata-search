class AddEchoformDigestToAccessConfiguration < ActiveRecord::Migration
  def change
    add_column :access_configurations, :echoform_digest, :text
  end
end
