require 'socket'

namespace :data do
  namespace :load do
    desc "Cache data contained in the ECHO 10 format to return with granule results"
    task :echo10 => ['environment'] do
      log_error do
        CollectionExtra.load_echo10
      end
    end

    desc "Data about granules in collections to return with granule results"
    task :granules => ['environment'] do
      log_error do
        CollectionExtra.load
      end
    end

    def log_error(&block)
      begin
        yield
      rescue
        job = CronJobHistory.new(task_name: 'data:load', last_run: Time.now, status: 'failed', message: "#{error.inspect}", host: Socket.gethostname)
        job.save!
        exit 1
      else
        job = CronJobHistory.new(task_name: 'data:load', last_run: Time.now, status: 'succeeded', host: Socket.gethostname)
        job.save!
      end
    end

  end

  desc "Load data from ECHO"
  task :load

  Rake::Task['data:load'].enhance(['data:load:echo10', 'data:load:granules'])

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
