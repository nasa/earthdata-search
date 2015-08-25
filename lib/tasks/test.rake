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
  task :prepare => 'colormaps:load' do
    FileUtils.mkdir_p 'build_output'
    FileUtils.mkdir_p 'test_results'
    FileUtils.mkdir_p 'tmp/capybara'
  end

  task :cleancache do
    FileUtils.rm_rf 'tmp/cache/assets'
  end
end

namespace :travis do
  task :ci => ['bamboo:prepare', 'db:migrate', 'db:seed', 'ci:prepare'] do
    if ENV['JASMINE'] == 'true'
      Rake::Task['jasmine:ci']
    else
      Rake::Task['knapsack:rspec']
    end
    Rake::Task['ci:cleancache']
  end
end

Rake::Task[:spec].enhance(['ci:prepare', 'jasmine:ci', 'ci:cleancache'])
