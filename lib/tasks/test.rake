Rake::Task[:test].enhance(['doc:ui']) do
  puts "[1/6] Precompiling assets"
  Rake::Task['assets:clobber'].invoke
  Rake::Task['assets:precompile'].invoke
  puts "[2/6] Generating UI documentation"
  Rake::Task['doc:ui'].invoke
  puts "[3/6] Running Jasmine Javascript specs"
  Rake::Task['jasmine:ci'].invoke
  puts "[4/6] Checking CSS style with CSS Lint"
  Rake::Task['test:csslint'].invoke
  puts "[5/6] Looking for unused CSS rules in the project documentation"
  Rake::Task['test:deadweight'].invoke
  puts "[6/6] Running Ruby specs"
  Rake::Task['spec'].invoke
end

namespace :ci do
  task :prepare do
    FileUtils.mkdir_p 'build_output'
  end
end

Rake::Task[:spec].enhance(['ci:prepare', 'jasmine:ci'])
