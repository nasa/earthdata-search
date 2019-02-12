# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)
# Prevent database truncation if the environment is production
abort('The Rails environment is running in production mode!') if Rails.env.production?
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!
require 'helpers/instrumentation'
require 'capybara-screenshot/rspec'
require 'rack_session_access/capybara'
require 'selenium-webdriver'

Capybara.register_driver :selenium do |app|
  options = Selenium::WebDriver::Chrome::Options.new(
    args: %w[headless disable-gpu no-sandbox --window-size=1440,900 --disable-notifications]

    ### use these args for debugging in chrome.
    # args: %w[headless disable-gpu no-sandbox --window-size=1440,900 --disable-notifications --remote-debugging-port=9222]
    ### Open Chrome with `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=remote-profile --remote-debugging-port=9222 --window-size=1440,900`
  )
  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
end
Capybara.javascript_driver = :selenium
Capybara.default_driver = :selenium
Capybara.register_server :thin do |app, port, host|
  require 'rack/handler/thin'
  Rack::Handler::Thin.run(app, Port: port, Host: host)
end

Capybara.server = :thin
Capybara.server_host = 'localhost'

# Avoid appending screenshot paths in CI environments, since it messes with repeat failure detection
Capybara::Screenshot.append_screenshot_path = false if ENV['CAPYBARA_APPEND_SCREENSHOT_PATH'] == 'false'

Capybara::Screenshot.register_filename_prefix_formatter(:rspec) do |example|
  "#{File.basename(example.metadata[:file_path])}-#{example.metadata[:line_number]}"
end

# Capybara.current_session.current_window.resize_to(1640, 2048)
# Capybara.current_session.driver.browser.manage.window.resize_to(2048, 1152)

# Un-comment to truncate the test log to only the most recent execution
# File.truncate(Rails.root.join("log/test.log"), 0)

require 'fileutils'

# Out-of-date assets hose specs and lead to confusing errors
FileUtils.rm_rf(Rails.root.join('public/assets'))
FileUtils.mkdir_p(Rails.root.join('tmp/screenshots'))

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
#
Dir[Rails.root.join('spec', 'helpers', '**', '*.rb')].each { |f| require f }
Dir[Rails.root.join('spec', 'support', '**', '*.rb')].each { |f| require f }

# Checks for pending migrations and applies them before tests are run.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  puts e.to_s.strip
  exit 1
end

load "#{::Rails.root}/db/seeds.rb" if ENV['seed'] == 'true'

# http://stackoverflow.com/questions/11012407/set-json-max-nesting-option-from-within-ruby-on-rails-application/11013407#11013407
module JSON
  class << self
    def parse(source, opts = {})
      opts = { max_nesting: 350 }.merge(opts)
      result = nil
      begin
        result = Parser.new(source, opts).parse
      rescue StandardError
        puts "Bad json: #{source}"
      end
      result
    end
  end
end

RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  # config.use_transactional_fixtures = true

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, :type => :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")

  Capybara.default_max_wait_time = (ENV['CAPYBARA_WAIT_TIME'] || 15).to_i

  config.after :all do |example_from_block_arg|
    example = config.respond_to?(:expose_current_running_example_as) ? example_from_block_arg : self.example

    if Capybara.page.respond_to?(:save_page) && Capybara.page.current_url
      # Attempt to detect before :all block failures
      exceptions = self.class.descendant_filtered_examples.map(&:exception)
      if exceptions.none?(&:nil?) && exceptions.uniq.size == 1
        # Failure only code goes here
        if defined?(page) && page && page.driver && defined?(page.driver.console_messages)
          puts 'Console messages:' + page.driver.console_messages.map { |m| m[:message] }.join('\n')
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

    config_services = Rails.configuration.services

    # Avoid recording tokens
    %w[prod uat sit].each do |urs_env|
      # The client_ids are stored in services.yml and keyed by the
      # URL of the respective environment
      urs_root_url = config_services['earthdata'][urs_env]['urs_root']

      %w[edsc edscbasic expired_token].each do |token_key|
        # Read from services.yml and is set to either the token provided in a designated
        # ENV variable or a default value
        configured_token = Class.new.extend(Helpers::SecretsHelpers).urs_tokens[token_key][urs_env]['access_token']

        # Because this is only for running rspec, we're only concerned
        # with the `test` rails environment
        ['test'].each do |rails_env|
          client_id = config_services['urs'][rails_env][urs_root_url]

          token = configured_token.include?('-') ? configured_token : "#{configured_token}:#{client_id}"
          substitute = token_key
          substitute += '-access' unless configured_token.include? '-'
          normalizers << VCR::HeaderNormalizer.new('Echo-Token', token, substitute)
        end
      end
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

  config.after :all do
    Delayed::Worker.delay_jobs = false
    timings[self.class.description] = Time.now - file_time
    index += 1

    puts " (Suite #{index} of #{count})"

    # Include deprecated 'DatasetExtra' here to prevent an error on model.destroy_all.
    # For more info, see comments in dataset_extra.rb
    models_to_preserve = [CollectionExtra, ActiveRecord::SchemaMigration, DatasetExtra, Colormap]
    ActiveRecord::Base.descendants.each do |model|
      model.destroy_all unless models_to_preserve.include?(model)
    end
  end

  config.before :suite do
    count = config.loaded_spec_files.count
  end

  config.after :suite do
    Helpers::Instrumentation.report_performance

    puts
    puts 'Slowest specs'
    puts (timings.sort_by(&:reverse).reverse.map { |k, v| format("%7.3fs - #{k}\n", v) })
    puts
  end

  config.before :each do
    Rails.logger.info "Executing test: #{RSpec.current_example.metadata[:example_group][:file_path]}:#{RSpec.current_example.metadata[:example_group][:line_number]}"
  end

  config.after :each do
    unless RSpec.current_example.exception.nil?
      # Failure only code goes here
      if defined?(page) && page && page.driver && defined?(page.driver.console_messages)
        puts "Console messages:\n" + page.driver.console_messages.map { |m| m[:message] }.join("\n")
      end
    end
  end

  config.include RSpec::Rails::FixtureSupport

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
  config.include Helpers::MockHelpers
  # config.include ::CapybaraExtension
  # config.include ::CapybaraSeleniumExtension
end
