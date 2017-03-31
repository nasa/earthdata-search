class ChangeEchoformDigestToText < ActiveRecord::Migration
  def change
  	change_column :access_configurations, :echoform_digest, :text
  end
end
