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

module RSpec
  module Core
    class Configuration
      def configure_group_with(group, module_list, application_method)
        module_list.items_for(group.metadata).each do |mod|
          # puts "configure_group_with: #{mod.inspect}"
          mod = Snappybara::DSL if mod == Capybara::DSL
          __send__(application_method, mod, group)
        end
      end
    end
  end
end
