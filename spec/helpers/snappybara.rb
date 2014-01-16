# This module duplicates the methods in Capybara::DSL.  Capybara's RSpec hooks
# look to see if Capybara::DSL has been included to know whether to reset all
# sessions and drivers.  By including Snappybara::DSL instead of Capybara::DSL,
# we cause those hooks to be ignored and avoid resetting the session after every
# spec.
module Snappybara
  module DSL
    def using_session(name, &block)
      Capybara.using_session(name, &block)
    end

    def using_wait_time(seconds, &block)
      Capybara.using_wait_time(seconds, &block)
    end

    def page
      Capybara.current_session
    end

    Capybara::Session::DSL_METHODS.each do |method|
      define_method method do |*args, &block|
        page.send method, *args, &block
      end
    end
  end
end

RSpec.configure do |config|
  # Replace Capybara::DSL with Snappybara::DSL in RSpec's included modules
  config.include_or_extend_modules.each do |mod|
    mod[1] = Snappybara::DSL if mod[1] == Capybara::DSL
  end

  config.before :each do |parent|
    if self.class.include?(Snappybara::DSL)
      driver = Capybara.default_driver
      driver = Capybara.javascript_driver if example.metadata[:js]
      driver = example.metadata[:driver] if example.metadata[:driver]

      if example.metadata[:reset] || driver != Capybara.current_driver
        Capybara.reset_sessions!
        Capybara.current_driver = driver
      end
    end
  end

  config.after(:suite) do
    Capybara.reset_sessions!
  end
end
