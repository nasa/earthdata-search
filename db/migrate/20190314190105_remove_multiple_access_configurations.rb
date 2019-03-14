class RemoveMultipleAccessConfigurations < ActiveRecord::Migration
  def up
    # Pre e2e access configurations could have multiple access methods.
    # This removes any extra options from the database.
    AccessConfiguration.all.each do |access_configuration|
      access_methods = access_configuration.service_options.fetch('accessMethod', [])
      access_configuration.service_options = {
        'accessMethod' => Array.wrap(access_methods.first)
      }
      access_configuration.save
    end
  end
end
