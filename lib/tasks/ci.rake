desc "Run continuous integration build"
task :ci do
  puts "[1/5] Generating UI documentation"
  Rake::Task['doc:ui'].invoke
  puts "[2/5] Running Ruby specs"
  Rake::Task['spec'].invoke
  puts "[3/5] Running Jasmine Javascript specs"
  Rake::Task['jasmine:ci'].invoke
  puts "[4/5] Checking CSS style with CSS Lint"
  Rake::Task['csslint'].invoke
  puts "[5/5] Looking for unused CSS rules in the project documentation"
  Rake::Task['deadweight'].invoke
end
