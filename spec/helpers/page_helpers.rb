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
      #@waiting ||= 0
      synchronize(120) do
        #message = lambda do |time, value|
        #  @waiting += time
        #  puts "window.edsc.util.xhr.hasPending() -> %.3f #{value.inspect}.  Total: %.3f" % [time, @waiting]
        #end
        #result = Echo::Util.time(::Logger.new(STDOUT), message) do
        #  page.evaluate_script('window.edsc.util.xhr.hasPending()')
        #end

        expect(page.evaluate_script('window.edsc.util.xhr.hasPending()')[0]).to be_false
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
          if (Time.now - start_time) >= seconds
            Capybara::Screenshot.screenshot_and_save_page
            raise
          end
          sleep(0.05)
          retry
        ensure
          @synchronized = false
        end
      end
    end

    # Resets the query filters and waits for all the resulting xhr requests to finish.
    def reset_search(wait=true)
      page.execute_script('edsc.page.clearFilters()')
      wait_for_xhr
    end

    # Logout the user
    def reset_user
      page.execute_script("window.edsc.models.page.current.user.logout()")
      wait_for_xhr
    end

    def logout
      reset_user
    end

    def click_contact_information
      page.execute_script("$('.dropdown-menu .dropdown-link-contact-info').click()")
    end

    def click_logout
      # Do this in Javascript because of capybara clickfailed bug
      # page.execute_script("$('.dropdown-menu .dropdown-link-logout').click()")
      visit '/logout'
    end

    def login(username='edsc', password='EDSCtest!1')
      click_link 'Sign In'
      fill_in 'Username', with: username
      fill_in 'Password', with: password
      click_button 'Sign In'
      wait_for_xhr
    end

    def have_popover(title=nil)
      if title.nil?
        have_css('.tour')
      else
        have_css('.popover-title', text: title)
      end
    end

    def have_no_popover(title=nil)
      if title.nil?
        have_no_css('.tour')
      else
        have_no_css('.popover-title', text: title)
      end
    end

    def keypress(selector, key)
      keyCode = case key
                when :enter then 13
                when :left then 37
                when :up then 38
                when :right then 39
                when :down then 40
                else key.to_i
                end

      script = "$('#{selector}').trigger($.Event('keydown', { keyCode: #{keyCode} }));"
      page.execute_script script
    end

    def reset_access_page
      script = "edsc.page.ui.serviceOptionsList.activeIndex(0);
                edsc.page.project.datasets()[0].serviceOptions.accessMethod.removeAll();
                edsc.page.project.datasets()[0].serviceOptions.addAccessMethod();"
      page.execute_script script
    end

    private

    def page
      Capybara.current_session
    end
  end
end
