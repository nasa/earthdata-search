# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'

require 'capybara-screenshot/rspec'

if ENV['driver'] == 'poltergeist'
  require 'capybara/poltergeist'
  Capybara.javascript_driver = :poltergeist
  Capybara.default_driver = :poltergeist
else
  require 'capybara-webkit'
  Capybara.javascript_driver = :webkit
  Capybara.default_driver = :webkit
end

# Avoid appending screenshot paths in CI environments, since it messes with repeat failure detection
Capybara::Screenshot.append_screenshot_path = false if ENV["CAPYBARA_APPEND_SCREENSHOT_PATH"] == 'false'

require 'fileutils'

# Out-of-date assets hose specs and lead to confusing errors
FileUtils.rm_rf(Rails.root.join("public/assets"))
FileUtils.mkdir_p(Rails.root.join("tmp/screenshots"))

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/helpers/**/*.rb")].each { |f| require f }

# Checks for pending migrations before tests are run.
# If you are not using ActiveRecord, you can remove this line.
ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

FactoryGirl.find_definitions


load "#{::Rails.root}/db/seeds.rb" if ENV["seed"] == "true"

# http://stackoverflow.com/questions/11012407/set-json-max-nesting-option-from-within-ruby-on-rails-application/11013407#11013407
module JSON
  class << self
    def parse(source, opts = {})
      opts = ({:max_nesting => 350}).merge(opts)
      result = nil
      begin
        result = Parser.new(source, opts).parse
      rescue => e
        puts "Bad json: #{source}"
      end
      result
    end
  end
end

Capybara::Screenshot.register_filename_prefix_formatter(:rspec) do |example|
  meta = example.metadata
  "#{File.basename(meta[:file_path])}-#{meta[:line_number]}"
end

RSpec.configure do |config|

  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.global_fixtures = :all

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  # config.use_transactional_fixtures = true

  Capybara.default_wait_time = (ENV['CAPYBARA_WAIT_TIME'] || 10).to_i
  wait_time = Capybara.default_wait_time

  config.before :each do
    if Capybara.current_driver == :rack_test
      DatabaseCleaner.strategy = :transaction
    else
      DatabaseCleaner.strategy = :truncation, {:except => ['dataset_extras', 'orders']}
    end
    DatabaseCleaner.start
  end

  config.before :all do
    Capybara.default_wait_time = [(self.class.metadata[:wait] || wait_time), wait_time].max
  end

  config.after :all do
    Capybara.default_wait_time = wait_time
  end

  config.after :each do
    tries = 0
    begin
      tries += 1
      DatabaseCleaner.clean
    rescue => e
      $stderr.puts "Database cleaner clean failed: #{e}"
      if tries < 3
        sleep 1
        $stderr.puts "Retrying database clean"
        retry
      else
        $stderr.puts "Database cleaner clean failed after #{tries} tries: #{e}"
      end
    end
    if example.exception != nil
      # Failure only code goes here
      if defined?(page) && page && page.driver && defined?(page.driver.console_messages)
        puts "Console messages:" + page.driver.console_messages.map {|m| m[:message]}.join("\n")
      end
    end
  end

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  config.order = "random"

  config.include RSpec::Rails::FixtureSupport
  config.include FactoryGirl::Syntax::Methods

  config.extend SharedBrowserSession

  config.include Helpers::TimelineHelpers
  config.include Helpers::OverlayHelpers
  config.include Helpers::SpatialHelpers
  config.include Helpers::ProjectHelpers
  config.include Helpers::PageHelpers
  config.include Helpers::DatasetHelpers
  config.include Helpers::DefaultTags
  config.include Helpers::TemporalHelpers
  config.include Helpers::UrlHelpers
end
