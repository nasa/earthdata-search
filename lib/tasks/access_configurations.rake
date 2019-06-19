namespace :access_configuration do
  desc 'Delete multiple service_options from AccessConfigurations'
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

  desc 'Delete AccessConfigurations that have empty service_options'
  task delete_empty: ['environment'] do
    count = 0
    AccessConfiguration.all.each do |access_configuration|
      access_methods = access_configuration.service_options.fetch('accessMethod', [])
      if access_methods.empty?
        access_configuration.destroy
        count += 1
      end
    end
    puts "Done! Removed #{count} empty AccessConfigurations"
  end

  desc 'Display the AccessConfiguration for a given user and collection'
  task :print_user_access_methods_for_collection, [:user_id, :collection_id] => ['environment'] do |_task, args|
    puts AccessConfiguration.get_default_access_config(args[:user_id], args[:collection_id]).inspect
  end
end
