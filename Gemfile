source 'https://rubygems.org'
ruby '2.2.2'

gem 'rails', '~> 4.2.7.1'

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

group :test do
  gem 'database_cleaner'
  gem 'factory_girl'
  gem 'factory_girl_rails'
  gem 'capybara'
  # This is a revision which disables screenshots, one behind the disable-screenshots
  #  branch, which also tries (and fails) to avoid problems with concurrent test runs.
  gem 'capybara-webkit', git: 'https://github.com/bilts/capybara-webkit.git', branch: 'disable-screenshots'
  gem 'poltergeist'
  gem 'capybara-screenshot'
  gem 'rspec_junit_formatter'
  gem 'fuubar'
  gem "rack_session_access"
  gem 'headless'
end

group :development do
  gem 'quiet_assets'

  # For dumping additional metadata stored in DatasetExtras and similar
  gem 'seed_dump'
  gem 'rubocop', require: false
end

group :production do
  gem 'pg'
  gem 'rails_12factor'
end

group :sit, :uat, :lab do
  gem 'pg'
  gem 'rails_12factor'
end

# Gems that are mostly used for testing but useful to have available via CLI
group :development, :test do
  gem 'thin'
  gem 'rspec-rails'
  gem 'colored'
  gem 'vcr'
  gem 'sqlite3'
  gem 'knapsack'

  gem 'jasmine'
  gem 'jasmine_junitxml_formatter'

  gem 'therubyracer', :require => 'v8'
end

group :assets, :development, :test do
  gem 'execcsslint' # CSS Lint
  gem 'deadweight' # Finds unused styles
end

# Gems used only for assets and not required
# in production environments by default.
group :assets, :test do
  gem 'sass-rails',   '~> 4.0.0'
  gem 'coffee-script', :require => 'coffee_script'
  gem 'coffee-rails', '~> 4.0.0'

  gem 'uglifier', '>= 1.3.0'
end

gem 'jquery-rails'
gem 'bourbon'
gem 'knockoutjs-rails'
gem 'figaro'

gem 'delayed_job_active_record'
gem 'daemons'

gem 'nokogiri'
gem 'responders', '~> 2.0'

# Eventually we'll need these, but there's version conflict when installing
#gem 'crossroadsjs-rails'
#gem 'jssignals-rails'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'debugger'
