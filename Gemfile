source 'https://rubygems.org'
ruby '2.5.1'

gem 'rails', '~> 4.2.11'

gem 'aasm'
gem 'atomic'
gem 'autoprefixer-rails', '8.6.5' # Need to run an older version due to issues with ExecJS runtime
gem 'bourbon'
gem 'daemons'
gem 'delayed_job_active_record'
gem 'faraday'
gem 'faraday_middleware'
gem 'figaro'
gem 'jbuilder'
gem 'jquery-rails'
gem 'knockoutjs-rails'
gem 'multi_xml'
gem 'nokogiri'
gem 'obfuscate_id', git: 'https://github.com/namick/obfuscate_id.git', ref: 'a89da600f389c53c88362ce5133d8d3945776464'
gem 'pg'
gem 'rack-rewrite'
gem 'responders', '~> 2.0'
gem 'toastr-rails'
gem 'unicorn'
gem 'whenever', require: false

group :test do
  gem 'capybara'
  gem 'capybara-screenshot'
  gem 'chromedriver-helper'
  gem 'database_cleaner'
  gem 'rack_session_access'
  gem 'rspec_junit_formatter'
  gem 'selenium-webdriver'
  gem 'shoulda-callback-matchers'
  gem 'sqlite3'
end

group :development do
  gem 'guard-coffeescript'
  gem 'guard-livereload', require: false
  gem 'quiet_assets'

  # For dumping additional metadata stored in DatasetExtras and similar
  gem 'rubocop', require: false
  gem 'seed_dump'
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
  gem 'therubyracer', require: 'v8'
  gem 'thin'
  gem 'vcr'
end

group :assets, :development, :test do
  gem 'deadweight' # Finds unused styles
  gem 'execcsslint' # CSS Lint
end

# Gems used only for assets and not required
# in production environments by default.
group :assets, :test do
  gem 'coffee-rails', '~> 4.0.0'
  gem 'coffee-script', require: 'coffee_script'
  gem 'sass-rails', '~> 4.0.0'
  gem 'uglifier', '>= 1.3.0'
end
