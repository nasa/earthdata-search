namespace :background_jobs do
  desc 'Check if delayed_job process is still running, restart if needed.'
  task :check do
    lines = `ps aux | grep [d]elayed_job | wc -l`.chomp.to_i
    if lines > 0
      puts 'delayed_job process already running'
    else
      puts 'Starting delayed_job process'
      `#{File.join(Rails.root, 'bin/delayed_job')} start`
    end
  end

  desc 'Stop currently running delayed_job process'
  task :stop do
    `#{File.join(Rails.root, 'bin/delayed_job')} stop`
  end

  desc 'Count the number of records in the queue'
  task status: ['environment'] do
    DelayedJob.all.group_by(&:queue).each do |queue, records|
      puts "#{queue}: #{records.count}"
    end
  end

  desc 'Migrate old queue names to more efficient queues'
  task migrate: ['environment'] do
    DelayedJob.where("handler LIKE '%job_class: SubmitLegacyServicesJob%'").update_all(queue: 'legacy_services')
    DelayedJob.where("handler NOT LIKE '%job_class: SubmitLegacyServicesJob%'").update_all(queue: 'default')
  end

  desc 'Kick of an order status job for a retreival provided the obfuscated retrieval id'
  task :create_order_status_job, [:retrieval_id] => ['environment'] do |task, args|
    # Accepts an obfuscated retrieval
    retrieval = Retrieval.find(args[:retrieval_id])

    OrderStatusJob.perform_later(retrieval.id, retrieval.token, retrieval.environment)
  end
end
