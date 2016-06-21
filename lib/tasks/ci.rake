namespace :test do
  desc "Run the continuous integration build"
  task :ci => [:test]
end
