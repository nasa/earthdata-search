namespace :data do
  namespace :thumbnails do
    desc "Load dataset thumbnails from ECHO"
    task :load => ['environment'] do
      DatasetExtra.load_thumbnails
    end
  end
end

Rake::Task['data:load'].enhance(['data:thumbnails:load'])
