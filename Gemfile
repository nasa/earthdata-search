source 'https://rubygems.org'
ruby '2.5.1'

gem 'rails', '~> 4.2.10'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'faraday'
gem 'faraday_middleware'
gem 'multi_xml'
gem 'toastr-rails'
gem 'unicorn'
gem 'whenever', :require => false

gem 'obfuscate_id', git: 'https://github.com/namick/obfuscate_id.git', ref: 'a89da600f389c53c88362ce5133d8d3945776464'

gem 'atomic'
gem 'rack-rewrite'

gem 'pg'

group :test do
  gem 'database_cleaner'
  gem 'factory_girl'
  gem 'factory_girl_rails'
  gem 'capybara'
  gem 'selenium-webdriver'
  gem 'chromedriver-helper'
  gem 'capybara-screenshot'
  gem 'rspec_junit_formatter'
  gem 'rack_session_access'
  gem 'sqlite3'
end

group :development do
  gem 'guard-livereload', require: false
  gem 'guard-coffeescript'
  gem 'quiet_assets'

  # For dumping additional metadata stored in DatasetExtras and similar
  gem 'seed_dump'
  gem 'rubocop', require: false
end

group :sit, :uat, :production, :lab do
  gem 'rails_12factor'
end

# Gems that are mostly used for testing but useful to have available via CLI
group :development, :test do
  gem 'byebug'
  gem 'colored'
  gem 'jasmine'
  gem 'jasmine_junitxml_formatter'
  gem 'knapsack'
  gem 'rspec-rails'
  gem 'therubyracer', :require => 'v8'
  gem 'thin'
  gem 'vcr'
end

group :assets, :development, :test do
  gem 'execcsslint' # CSS Lint
  gem 'deadweight' # Finds unused styles
end

# Gems used only for assets and not required
# in production environments by default.
group :assets, :test do
  gem 'sass-rails', '~> 4.0.0'
  gem 'coffee-script', require: 'coffee_script'
  gem 'coffee-rails', '~> 4.0.0'

  gem 'uglifier', '>= 1.3.0'
end

gem 'jquery-rails'
gem 'bourbon'
gem 'autoprefixer-rails', '8.6.5' # Need to run an older version due to issues with ExecJS runtime
gem 'knockoutjs-rails'
gem 'figaro'

gem 'delayed_job_active_record'
gem 'daemons'

gem 'nokogiri'
gem 'responders', '~> 2.0'
