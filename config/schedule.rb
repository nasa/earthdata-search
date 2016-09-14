# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
require File.expand_path(File.dirname(__FILE__) + "/../config/environment")

set :environment, Rails.env
set :job_template, "/bin/bash -c 'PATH=#{File.dirname(`which ruby`)}:$PATH; :job'"
#TODO: This should be reverted when production is in the cloud
job_type :edsc_rake, "cd :path && :environment_variable=:environment #{Rails.env == 'production' ? '' : 'foreman '}run bundle exec rake :task --silent :output"

every 1.hour do
  edsc_rake "data:load:tags"
  edsc_rake "data:load:echo10"
  edsc_rake "data:load:granules"
end

every 1.day do
  edsc_rake "colormaps:load"
end
