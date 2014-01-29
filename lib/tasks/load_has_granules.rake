namespace :data do
  namespace :granule_information do
    desc "Load granule information from ECHO"
    task :load => ['environment'] do
      DatasetExtra.load_granule_information
    end
  end
end

Rake::Task['data:load'].enhance(['data:granule_information:load'])
