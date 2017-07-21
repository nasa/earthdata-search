require 'socket'

namespace :data do
  namespace :load do
    desc "Cache data contained in the ECHO 10 format to return with granule results"
    task :echo10 => ['environment'] do
      puts "Starting data:load:echo10"
      task_wrapper('data:load:echo10', 1.hour) do
        CollectionExtra.load_echo10
      end
    end

    desc "Data about granules in collections to return with granule results"
    task :granules => ['environment'] do
      puts "Starting data:load:granules"
      task_wrapper('data:load:granules', 1.hour) do
        CollectionExtra.load
      end
    end

    desc "Sync tags for services"
    task :tags => ['environment'] do
      puts "Starting data:load:tags"
      task_wrapper('data:load:tags', 1.hour) do
        CollectionExtra.sync_tags
      end
    end

    def task_wrapper(task, interval, &block)
      # There are two hosts in production. We need to make sure the rake tasks are run on both of them.
      # However too many requests sent from both of the hosts at the same time every hour time out due to the heavy load
      # on CMR side. We therefore alternate the cron jobs in OPS to fire only from one host at a time.

      # In detail, one of the host checks last run task in the db,
      # if "last_run" is within (1.5 * interval)
      #   check which host it comes from.
      #     if it's from the same host, stop
      #     else run the cron job
      # if no entries in the past (1.5 * interval) found, wait and re-check for ten times

      if Rails.env.production? || Rails.env.uat?
        tried = 0
        while tried < 10 do
          history_tasks = CronJobHistory.where(task_name: task).where(last_run: (Time.now - 1.5 * interval)..Time.now)

          if history_tasks.size > 0
            task1 = history_tasks.last
            task2 = history_tasks.select {|task| task.host != task1.host}.last

            if Socket.gethostname == task1.host
              # last time it was run on task1.host. Yield to the other instance this time.
              puts "Cron job #{task} has been run on #{task1.host}. Stop."
              return
            elsif task2.present? && Socket.gethostname == task2.host # && Socket.gethostname != task1.host
              # last time it was run on task2.host. Yield to the other instance this time.
              puts "Cron job #{task} has been run on #{task2.host}. Stop."
              return
            elsif task2.present? # && Socket.gethostname != task1.host && Socket.gethostname != task2.host
              # Both task1 and task2 exist in history
              # However, IPs of both the instances have changed (after a new deployment).
              puts "This is possibly a new deployment. Wait randomly for 0 to 60 seconds and retry."
              sleep rand(0..60)
              tried += 1
              puts "Wait is done. Retrying (#{tried}) on #{Socket.gethostname}."
              if tried == 10
                puts "Cron job #{task} is being started on #{Socket.gethostname}."
                job = CronJobHistory.new(task_name: task, last_run: Time.now, status: 'running', host: Socket.gethostname)
                job.save!
                id = job.id
                yield
              else
                next
              end
            else # task2.nil?
              # task1 not nil. But the host name is different now which means it is no different than a fresh deployment.
              puts "Cron job #{task} has been run for #{history_tasks.size} times (in total from both hosts) during the past #{(1.5 * interval).to_i / 3600.0} hours."
              puts "Cron job #{task} is being started on #{Socket.gethostname}."
              job = CronJobHistory.new(task_name: task, last_run: Time.now, status: 'running', host: Socket.gethostname)
              job.save!
              id = job.id
              tried = 10
              yield
            end
          else
            # neither has been run.
            puts "Cron job #{task} has not been run for #{(1.5 * interval).to_i / 3600.0} hours on #{Socket.gethostname}. Wait randomly for 0 to 60 seconds and retry."
            sleep rand(0..60)
            tried += 1
            puts "Wait is done. Retrying (#{tried}) on #{Socket.gethostname}."
            if tried == 10
              puts "Cron job #{task} is being started on #{Socket.gethostname}."
              job = CronJobHistory.new(task_name: task, last_run: Time.now, status: 'running', host: Socket.gethostname)
              job.save!
              id = job.id
              yield
            else
              next
            end
          end
        end
      else
        yield
      end
    rescue
      if id.present?
        job = CronJobHistory.find_by_id id
        job.last_run = Time.now
        job.status = 'failed'
        job.message = $!.message
      else
        job = CronJobHistory.new(task_name: task, last_run: Time.now, status: 'failed', message: $!.message, host: Socket.gethostname)
      end
      puts "Cron job #{task} failed with error on #{Socket.gethostname}: #{$!.message}"
      job.save!
      return
    else
      if id.present?
        job = CronJobHistory.find_by_id id
        job.last_run = Time.now
        job.status = 'succeeded'
      else
        job = CronJobHistory.new(task_name: task, last_run: Time.now, status: 'succeeded', host: Socket.gethostname)
      end
      puts "Cron job #{task} completed successfully on #{Socket.gethostname}."
      job.save!
    end
  end

  desc "Load data from ECHO"
  task :load

  Rake::Task['data:load'].enhance(['data:load:echo10', 'data:load:granules', 'data:load:tags'])

  namespace :dump do
    # Only dump the CollectionExtra model
    task :environment do
      ENV['MODEL'] = 'CollectionExtra'
    end

    # Gets run after db:seed:dump to ensure that seeds.rb is only loaded as needed
    task :headers do
      original_file = 'db/seeds.rb'
      new_file = original_file + '.new'
      File.open(new_file, 'w') do |f|
        lines = ["Cmep::Engine.load_seed if defined?(Cmep)",
                 "load_extra = CollectionExtra.maximum('updated_at').to_i < #{CollectionExtra.maximum('updated_at').to_i}",
                 "!load_extra && puts('CollectionExtra seeds are already up-to-date')",
                 "load_extra && puts('Loading CollectionExtra seeds')",
                 "load_extra && CollectionExtra.destroy_all",
                 "load_extra && "
                 ]
        f.print lines.join("\n")
        File.foreach(original_file) { |line| f.puts(line) }
      end
      File.rename(new_file, original_file)
    end
  end
end

if Rake::Task.task_defined?("db:seed:dump")
  Rake::Task["db:seed:dump"].enhance(['data:dump:environment']) do
    Rake::Task['data:dump:headers'].invoke
  end
end
