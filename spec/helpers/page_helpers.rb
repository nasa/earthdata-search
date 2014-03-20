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

    def synchronize(seconds=Capybara.default_wait_time)
      start_time = Time.now

      if @synchronized
        yield
      else
        @synchronized = true
        begin
          yield
        rescue => e
          raise e if (Time.now - start_time) >= seconds
          sleep(0.05)
          retry
        ensure
          @synchronized = false
        end
      end
    end

    # Resets the query filters and waits for all the resulting xhr requests to finish.
    def reset_search(wait=true)
      page.evaluate_script('window.edsc.models.page.current.query.clearFilters()')
      wait_for_xhr
    end

    # Logout the user
    def reset_user
      page.evaluate_script("window.edsc.models.page.current.user.logout()")
      wait_for_xhr
    end

    def logout
      reset_user
    end

    def login(username='edsc', password='EDSCtest!1')
      click_link 'Sign In'
      fill_in 'Username', with: username
      fill_in 'Password', with: password
      click_button 'Sign In'
      wait_for_xhr
    end

    def have_popover(title)
      have_css('.popover-title', text: title)
    end

    def have_no_popover(title)
      have_no_css('.popover-title', text: title)
    end

    private

    def page
      Capybara.current_session
    end
  end
end
