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
    Capybara.reset_sessions!
  end
end
