namespace :data do
  namespace :granule_information do
    desc "Load granule information from ECHO"
    task :load => ['environment'] do
      DatasetExtra.load_granule_information
    end
  end

  namespace :option_defs do
    desc "Load option definitions from ECHO"
    task :load => ['environment'] do
      DatasetExtra.load_option_defs
    end
  end
end

Rake::Task['data:load'].enhance(['data:granule_information:load'])
