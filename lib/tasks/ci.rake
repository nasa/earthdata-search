namespace :ci do
  task :prepare do
    FileUtils.mkdir_p 'build_output'
    FileUtils.mkdir_p 'test_results'
    FileUtils.mkdir_p 'tmp/capybara'
  end

  task :cleancache do
    FileUtils.rm_rf 'tmp/cache/assets'
  end
end
