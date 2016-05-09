class AddEchoformDigestToAccessConfiguration < ActiveRecord::Migration
  def change
    add_column :access_configurations, :echoform_digest, :string
  end
end
