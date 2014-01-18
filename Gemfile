source 'https://rubygems.org'

gem 'rails', '~> 4.0.0'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'sqlite3'
gem 'faraday'
gem 'faraday_middleware'
gem 'multi_xml'
gem 'term-ansicolor'
gem 'toastr-rails'

group :test do
  gem 'database_cleaner'
  gem 'factory_girl'
  gem 'factory_girl_rails'
  gem 'capybara'
  gem 'capybara-webkit'
  gem 'capybara-screenshot'
  gem 'vcr'
end

group :development do
  # Puppet / vagrant deployments using Capistrano
  gem 'puppet'
  gem 'librarian-puppet'
  gem 'rvm-capistrano'
  gem 'capistrano'

  gem 'quiet_assets'

  # For dumping additional metadata stored in DatasetExtras and similar
  gem 'seed_dump'
end

# Gems that are mostly used for testing but useful to have available via CLI
group :development, :test do
  gem 'rspec-rails'
  gem 'colored'
  gem 'deadweight' # Finds unused styles
  gem 'execcsslint' # CSS Lint

  # rspec-like environment for Javascript
  # The version available via rubygems (1.3.2) doesn't contain Rails 4 support
  # so we're specifying a newer version here.  This should be removed once we have
  # a newer release
  gem 'jasmine', :git => 'https://github.com/pivotal/jasmine-gem.git', :ref => 'e8105401'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets, :test do
  gem 'sass-rails',   '~> 4.0.0'
  gem 'coffee-script', :require => 'coffee_script'
  gem 'coffee-rails', '~> 4.0.0'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  #gem 'therubyracer', :platforms => :ruby

  gem 'uglifier', '>= 1.3.0'
end

group :production do
  gem 'pg'
end

gem 'jquery-rails'
gem 'bourbon'
gem 'knockoutjs-rails'

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
