namespace :background_jobs do
  desc "Check if delayed_job process is still running, restart if needed."
  task :check do
    lines = `ps aux | grep [d]elayed_job | wc -l`.chomp.to_i
    if lines > 0
      puts 'delayed_job process already running'
    else
      puts 'Starting delayed_job process'
      `#{File.join(Rails.root, 'bin/delayed_job')} start`
    end
  end

  desc "Stop currently running delayed_job process"
  task :stop do
    `#{File.join(Rails.root, 'bin/delayed_job')} stop`
  end
end
