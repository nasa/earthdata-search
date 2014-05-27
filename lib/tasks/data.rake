namespace :data do
  desc "Load data from ECHO"
  task :load => ['environment'] do
    DatasetExtra.load
  end
end
