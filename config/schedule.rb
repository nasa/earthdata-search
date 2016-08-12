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
set :environment, Rails.env
set :job_template, "/bin/bash -c 'PATH=#{File.dirname(`which ruby`)}:$PATH; :job'"
job_type :foreman_rake, "cd :path && :environment_variable=:environment foreman run bundle exec rake :task --silent :output"

every 1.hour do
  foreman_rake "data:load"
end

every 1.day do
  foreman_rake "colormaps:load"
end
