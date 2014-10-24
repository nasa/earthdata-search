namespace :data do
  namespace :load do
    desc "Cache data contained in the ECHO 10 format to return with granule results"
    task :echo10 => ['environment'] do
      DatasetExtra.load_echo10
    end

    desc "Data about granules in datasets to return with granule results"
    task :granules => ['environment'] do
      DatasetExtra.load
    end
  end

  desc "Load data from ECHO"
  task :load

  Rake::Task['data:load'].enhance(['data:load:echo10', 'data:load:granules'])

  namespace :dump do
    # Only dump the DatasetExtra model
    task :environment do
      ENV['MODEL'] = 'DatasetExtra'
    end

    # Gets run after db:seed:dump to ensure that seeds.rb is only loaded as needed
    task :headers do
      original_file = 'db/seeds.rb'
      new_file = original_file + '.new'
      File.open(new_file, 'w') do |f|
        lines = ["Cmep::Engine.load_seed",
                 "load_extra = DatasetExtra.maximum('updated_at').to_i < #{DatasetExtra.maximum('updated_at').to_i}",
                 "!load_extra && puts('DatasetExtra seeds are already up-to-date')",
                 "load_extra && puts('Loading DatasetExtra seeds')",
                 "load_extra && DatasetExtra.destroy_all",
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
