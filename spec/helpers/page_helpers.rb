module Helpers
  module PageHelpers
    def wait_for_xhr
      ActiveSupport::Notifications.instrument "edsc.performance.wait_for_xhr" do
        synchronize(30) do
          expect(page.evaluate_script('window.edsc.util.xhr.hasPending()')).to be_false
        end
      end
    end

    def wait_for_zoom_animation(zoom_to)
      script = "(function() {var map = $('#map').data('map').map; return map.getZoom();})();"
      synchronize do
        expect(page.evaluate_script(script).to_i).to eql(zoom_to)
      end
    end

    def synchronize(seconds=Capybara.default_wait_time)
      start_time = Time.now

      count = 0

      if @synchronized
        yield
      else
        @synchronized = true
        begin
          yield
        rescue => e
          count += 1
          if (Time.now - start_time) >= seconds
            puts "ERROR: synchronize() timed out after #{Time.now - start_time} seconds and #{count} tries"
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

    def within_last_window
      within_window(page.driver.browser.get_window_handles.last) do
        yield
      end
    end

    # Resets the query filters and waits for all the resulting xhr requests to finish.
    def reset_search(wait=true)
      page.execute_script('edsc.page.clearFilters()')
      wait_for_xhr if wait
    end

    def logout
      visit '/logout'
    end

    def click_contact_information
      page.execute_script("$('.dropdown-menu .dropdown-link-contact-info').click()")
    end

    def login(key='edsc')
      path = URI.parse(page.current_url).path
      query = URI.parse(page.current_url).query

      be_logged_in_as(key)

      url = query.nil? ? path : path + '?' + query
      visit url
      wait_for_xhr
    end

    def be_logged_in_as(key)
      json = urs_tokens[key]

      page.set_rack_session(expires_in: json['expires_in'])
      page.set_rack_session(access_token: json['access_token'])
      page.set_rack_session(refresh_token: json['refresh_token'])
      page.set_rack_session(user_name: key)
      page.set_rack_session(logged_in_at: Time.now.to_i)
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
                when :delete then 46
                else key.to_i
                end

      script = "$('#{selector}').trigger($.Event('keydown', { keyCode: #{keyCode} }));"
      page.execute_script script
    end

    def reset_access_page
      script = "edsc.page.ui.serviceOptionsList.activeIndex(0);
                edsc.page.project.accessCollections()[0].serviceOptions.accessMethod.removeAll();
                edsc.page.project.accessCollections()[0].serviceOptions.addAccessMethod();"
      page.execute_script script
    end

    private

    def page
      Capybara.current_session
    end
  end
end
