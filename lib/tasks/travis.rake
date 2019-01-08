namespace :travis do
  task ci: ['ci:prepare', 'db:test:prepare'] do
    if ENV['JASMINE'] == 'true'
      Rake::Task['jasmine:ci'].invoke
    else
      Rake::Task['db:seed'].invoke

      # Pull down only the colormaps that are required by the recordings in VCR needed for our tests
      Rake::Task['travis:colormaps'].invoke

      # Knapsack splits up our rspec tests into same sized buckets to be ran on the separate nodes in Travis CI
      Rake::Task['knapsack:rspec'].invoke
    end

    Rake::Task['ci:cleancache'].invoke
  end

  task :colormaps do
    collections_recordings = File.open(File.join(Rails.root, 'fixtures/cassettes', 'collections_responses.yml'), 'r').read
    required_colormaps = collections_recordings.scan(/\"product\"\: ?\"([\w\s-]*)\"/).flatten.uniq

    Colormaps.load(required_colormaps)
  end
end
