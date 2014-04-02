source 'https://rubygems.org'

gem 'rails', '~> 4.0.0'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'faraday'
gem 'faraday_middleware'
gem 'multi_xml'
gem 'term-ansicolor'
gem 'toastr-rails'
gem 'unicorn'

# Rubygems version is incompatible with Rails 4
gem 'obfuscate_id', git: 'https://github.com/namick/obfuscate_id.git', ref: 'bc9c14fa3768db1b73f221895c57e1233120bac1'

group :test do
  gem 'database_cleaner'
  gem 'factory_girl'
  gem 'factory_girl_rails'
  gem 'capybara'
  gem 'capybara-webkit', git: 'https://github.com/bilts/capybara-webkit.git', branch: 'disable-screenshots'
  gem 'poltergeist'
  gem 'capybara-screenshot'
  gem 'rspec_junit_formatter'
  gem 'fuubar'
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

group :production do
  gem 'pg'
end

# Gems that are mostly used for testing but useful to have available via CLI
group :development, :test do
  gem 'rspec-rails'
  gem 'colored'
  gem 'vcr'
  gem 'sqlite3'

  # rspec-like environment for Javascript
  # The version available via rubygems (1.3.2) doesn't contain Rails 4 support
  # so we're specifying a newer version here.  This should be removed once we have
  # a newer release
  gem 'jasmine', :git => 'https://github.com/pivotal/jasmine-gem.git', :ref => 'e8105401'

  gem 'therubyracer', :require => 'v8'
  gem 'libv8', '~> 3.11.8.3'
  gem 'headless'
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
