namespace :access_configuration do
  task delete_multiples: ['environment'] do
    # Pre e2e access configurations could have multiple access methods.
    # This removes any extra options from the database.
    count = 0
    AccessConfiguration.all.each do |access_configuration|
      access_methods = access_configuration.service_options.fetch('accessMethod', [])
      access_configuration.service_options = {
        'accessMethod' => Array.wrap(access_methods.first)
      }
      access_configuration.save
      count += 1 if access_methods.size > 1
    end
    puts "Done! #{count} AccessConfigurations updated"
  end
end
