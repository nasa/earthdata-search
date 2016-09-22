app_root = File.expand_path(File.dirname(__FILE__) + '/..')

# Unicorn socket
#listen "#{app_root}/tmp/unicorn.sock", backlog: 64
listen(ENV['PORT'] || 3000, backlog: 64) #if ENV['RAILS_ENV'] == 'development'

# Set the working application directory
working_directory app_root

# Unicorn PID file location
pid "#{app_root}/tmp/unicorn.pid"

# Number of processes
worker_processes (ENV['RAILS_ENV'] == 'production' ? 4 : 1)

# Time-out
timeout 600

# Load the app up before forking.
preload_app true

# Garbage collection settings.
GC.respond_to?(:copy_on_write_friendly=) &&
  GC.copy_on_write_friendly = true

# If using ActiveRecord, disconnect (from the database) before forking.
before_fork do |server, worker|
  defined?(ActiveRecord::Base) &&
    ActiveRecord::Base.connection.disconnect!
end

# After forking, restore your ActiveRecord connection.
after_fork do |server, worker|
  defined?(ActiveRecord::Base) &&
    ActiveRecord::Base.establish_connection
end
