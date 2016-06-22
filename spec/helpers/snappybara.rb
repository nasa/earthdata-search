# This module duplicates the methods in Capybara::DSL.  Capybara's RSpec hooks
# look to see if Capybara::DSL has been included to know whether to reset all
# sessions and drivers.  By including Snappybara::DSL instead of Capybara::DSL,
# we cause those hooks to be ignored and avoid resetting the session after every
# spec.
module Snappybara
  module DSL
    Capybara::DSL.instance_methods.each do |method|
      # The Capybara module gets extended with Capybara::DSL, so we can simply
      # delegate method calls to that module
      define_method method do |*args, &block|
        Capybara.send method, *args, &block
      end
    end
  end

  def self.wait_for_requests_complete
    stop_client
    Middleware::RackRequestBlocker.block_requests!
    requests = Middleware::RackRequestBlocker.num_active_requests
    puts "Waiting for #{requests} requests before continuing" unless requests == 0
    wait_for('pending AJAX requests complete') do
      Middleware::RackRequestBlocker.num_active_requests == 0
    end
  ensure
    Middleware::RackRequestBlocker.allow_requests!
  end

  # Navigate away from the current page which will prevent any new requests from being started
  def self.stop_client
    Capybara.page.execute_script %Q{
    window.location = "about:blank";
  }
  end

  # Waits until the passed block returns true
  def self.wait_for(condition_name, max_wait_time: 30, polling_interval: 0.01)
    wait_until = Time.now + max_wait_time.seconds
    while true
      return if yield
      if Time.now > wait_until
        raise "Condition not met: #{condition_name}"
      else
        sleep(polling_interval)
      end
    end
  end
end

RSpec.configure do |config|
  # Replace Capybara::DSL with Snappybara::DSL in RSpec's included modules
  config.include_or_extend_modules.each do |mod|
    mod[1] = Snappybara::DSL if mod[1] == Capybara::DSL
  end

  # (From lib/capybara/rspec.rb)
  # A work-around to support accessing the current example that works in both
  # RSpec 2 and RSpec 3.
  fetch_current_example = RSpec.respond_to?(:current_example) ?
    proc { RSpec.current_example } : proc { |context| context.example }

  # Combines the work done in before and after hooks in lib/capybara/rspec.rb.
  # When we encounter a spec that uses Capybara, we reset the sessions if
  # the spec has a "reset" tag or the spec defines a different driver than
  # the current session.
  config.before do |parent|
    if self.class.include?(Snappybara::DSL)
      example = fetch_current_example.call(self)
      driver = Capybara.default_driver
      driver = Capybara.javascript_driver if example.metadata[:js]
      driver = example.metadata[:driver] if example.metadata[:driver]

      if example.metadata[:reset] || driver != Capybara.current_driver
        Capybara.reset_sessions!
        Capybara.current_driver = driver
      end
    end
  end

  # Reset sessions between each top-level describe
  config.after(:all) do
    if Capybara.page
      Snappybara.wait_for_requests_complete
      Capybara.reset_sessions!
    end
  end
end
