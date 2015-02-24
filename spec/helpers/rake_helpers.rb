def check_process
  `ps aux | grep [d]elayed_job | wc -l`.chomp.to_i
end

# try using shell command to launch rake task
def run_check_task
  # Rake::Task["background_jobs:check"].reenable
  # Rake.application.invoke_task 'background_jobs:check'
  `RAILS_ENV=test bundle exec rake background_jobs:check`
end

def run_stop_task
  # Rake::Task["background_jobs:stop"].reenable
  # Rake.application.invoke_task 'background_jobs:stop'
  `RAILS_ENV=test bundle exec rake background_jobs:stop`
end
