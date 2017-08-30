# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
ENV["PRECOMPILE_NODE_ASSETS"] ||= 'true'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'

require 'headless'
require 'helpers/instrumentation'

# Un-comment to truncate the test log to only the most recent execution
#File.truncate(Rails.root.join("log/test.log"), 0)

require 'capybara-screenshot/rspec'
require 'rack_session_access/capybara'

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

  config.after :all do |example_from_block_arg|
    example = config.respond_to?(:expose_current_running_example_as) ? example_from_block_arg : self.example

    if Capybara.page.respond_to?(:save_page) && Capybara.page.current_url
      # Attempt to detect before :all block failures
      examples = self.class.descendant_filtered_examples
      exceptions = self.class.descendant_filtered_examples.map(&:exception)
      if !exceptions.any?(&:nil?) && exceptions.uniq.size == 1
        # Failure only code goes here
        if defined?(page) && page && page.driver && defined?(page.driver.console_messages)
          puts "Console messages:" + page.driver.console_messages.map {|m| m[:message]}.join("\n")
        end
        paths = Capybara::Screenshot.screenshot_and_save_page
        puts "     Screenshot: #{paths[:image]}"
        puts "     HTML page: #{paths[:html]}"
      end
    end
  end

  count = 0
  index = 0
  file_time = 0
  timings = {}

  config.before :suite do
    normalizers = []
    # Avoid recording tokens
    ['edsc', 'edscbasic', 'expired_token'].each do |token_key|
      token = Class.new.extend(Helpers::SecretsHelpers).urs_tokens[token_key]['access_token']
      token = "#{token}:#{Rails.configuration.urs_client_id}" unless token.include? '-'
      normalizers << VCR::HeaderNormalizer.new('Echo-Token', token, token_key)
    end

    normalizers << VCR::HeaderNormalizer.new('Echo-Token', "invalid:#{Rails.configuration.urs_client_id}", 'invalid')
    # Avoid recording ogre and places urls
    normalizers << VCR::UriNormalizer.new(ENV['ogre_url'], 'http://ogre.example.com')
    normalizers << VCR::UriNormalizer.new(ENV['places_url'], 'http://places.example.com/')
    normalizers << VCR::UriNormalizer.new("username=#{ENV['places_user_id']}&maxRows", 'username=edsc&maxRows')

    normalizers.each do |normalizer|
      VCR::EDSCConfigurer.register_normalizer(normalizer)
    end
  end

  config.before :suite do
    count = self.class.children.size
    Headless.new(:destroy_on_exit => false).start
  end

  config.before :each do
    Rails.logger.info "Executing test: #{example.metadata[:example_group][:file_path]}:#{example.metadata[:example_group][:line_number]}"
  end

  config.before :all do
    file_time = Time.now
    Capybara.default_wait_time = [(self.class.metadata[:wait] || wait_time), wait_time].max
    Capybara.current_session.driver.resize_window(1280, 1024)
  end

  config.after :all do
    Capybara.default_wait_time = wait_time
    Delayed::Worker.delay_jobs = false
    timings[self.class.display_name] = Time.now - file_time
    index += 1
    puts " (Suite #{index} of #{count})"

    # include deprecated 'DatasetExtra' here to prevent an error on model.destroy_all. For more info, see comments in
    # dataset_extra.rb
    models_to_preserve = [CollectionExtra, ActiveRecord::SchemaMigration, DatasetExtra]
    ActiveRecord::Base.descendants.each do |model|
      model.destroy_all unless models_to_preserve.include?(model)
    end
  end

  config.after :suite do
    puts
    puts "Slowest specs"
    puts (timings.sort_by(&:reverse).reverse.map {|k, v| "%7.3fs - #{k}" % v}.join("\n"))
    puts
  end

  config.after :suite do
    Helpers::Instrumentation.report_performance
  end

  config.after :each do
    if example.exception != nil
      # Failure only code goes here
      if defined?(page) && page && page.driver && defined?(page.driver.console_messages)
        puts "Console messages:\n" + page.driver.console_messages.map {|m| m[:message]}.join("\n")
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

  config.include Helpers::SecretsHelpers
  config.include Helpers::TimelineHelpers
  config.include Helpers::OverlayHelpers
  config.include Helpers::SpatialHelpers
  config.include Helpers::ProjectHelpers
  config.include Helpers::PageHelpers
  config.include Helpers::CollectionHelpers
  config.include Helpers::DefaultTags
  config.include Helpers::TemporalHelpers
  config.include Helpers::UrlHelpers
end
