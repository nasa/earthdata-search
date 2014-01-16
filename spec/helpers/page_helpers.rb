module Helpers
  module PageHelpers
    # Important: This will only wait for xhr that has started at the time of the call (duh, right?)
    #            Unfortunately, since the capybara-webkit UI is async, if you interact with the UI
    #            in a way that spawns an xhr call (say, filling in a text field or clicking a button)
    #            and then call this method, it's very likely that the xhr call will not have spawned
    #            yet when you call this method.
    #            Usually you only want to call this method after making an evaluate_script call that
    #            spawns xhr requests, because evaluate_script will happen synchronously.
    #            Use with care.
    def wait_for_xhr
      require "timeout"
      Timeout.timeout(Capybara.default_wait_time) do
        sleep(0.1) while page.evaluate_script('window.edsc.util.xhr.hasPending()')
      end
    end

    # Resets the query filters and waits for all the resulting xhr requests to finish.
    def reset_search
      page.evaluate_script('window.edsc.models.searchModel.query.clearFilters()')
      wait_for_xhr
    end

    private

    def page
      Capybara.current_session
    end
  end
end
