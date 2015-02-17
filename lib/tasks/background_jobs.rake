namespace :background_jobs do
  desc "Check if delayed_job process is still running, restart if needed."
  task :check do
    lines = `ps aux | grep [d]elayed_job | wc -l`.chomp.to_i
    if lines > 0
      puts 'delayed_job process already running'
    else
      puts 'Starting delayed_job process'
      `RAILS_ENV=production bin/delayed_job start` # production
      # `bin/delayed_job start` # development
    end
  end
end
