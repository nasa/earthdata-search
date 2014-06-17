namespace :data do
  desc "Load data from ECHO"
  task :load => ['environment'] do
    DatasetExtra.load
    DatasetExtra.load_echo10
  end
end
