module Helpers
  module PageHelpers
    def wait_for_xhr
      ActiveSupport::Notifications.instrument "edsc.performance.wait_for_xhr" do
        synchronize(60) do
          expect(page.execute_script('try { return window.edsc.util.xhr.hasPending(); } catch { return false; }')).to be_false
        end
      end
    end

    def wait_for_zoom_animation(zoom_to)
      script = "return $('#map').data('map').map.getZoom();"

      synchronize do
        expect(page.execute_script(script).to_i).to eql(zoom_to)
      end
    end

    def fetch_download_links
      synchronize(30) do
        expect(page).not_to have_content('Loading more')
      end
    end

    def synchronize(seconds=Capybara.default_max_wait_time)
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
          sleep(0.2)
          retry
        ensure
          @synchronized = false
        end
      end
    end

    def within_last_window
      within_window(windows.last) do
        yield
      end
    end

    # Resets the query filters and waits for all the resulting xhr requests to finish.
    def reset_search(wait=true)
      page.execute_script('edsc.page.clearFilters()')
      wait_for_xhr if wait
    end

    def reset_facet_ui
      page.execute_script("$('.facets-list-show').prev('.panel-heading').find('a').trigger('click')")
      page.execute_script("$('.facets-list-hide:first').trigger('click')")
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
      page.execute_script("$('#closeInitialTourModal').trigger('click')")
    end

    def cmr_env
      query_params = Rack::Utils.parse_nested_query(URI.parse(page.current_url).query)
      
      if %w(sit uat prod ops).include? query_params['cmr_env']
        query_params['cmr_env']
      elsif page.get_rack_session.key?('cmr_env')
        page.get_rack_session_key('cmr_env')
      elsif Rails.application.config.respond_to?(:cmr_env)
        Rails.configuration.cmr_env
      else
        'prod'
      end
    end

    def be_logged_in_as(key, env = nil)
      token_key = urs_tokens[key]

      # Get environment specific keys for creating cassettes
      en = (env.to_s unless env.nil?) || cmr_env
      json = token_key[en]

      page.set_rack_session(expires_in: json['expires_in'])
      page.set_rack_session(access_token: json['access_token'])
      page.set_rack_session(refresh_token: json['refresh_token'])
      page.set_rack_session(user_name: key)
      page.set_rack_session(logged_in_at: Time.now.to_i)
    end

    def dismiss_banner
      wait_for_xhr
      # Let's get the tour modal while we're at it...
      page.execute_script("$('#closeInitialTourModal').trigger('click')")

      # Now the banner
      if page.has_css?('.banner-close')
        page.find('a[class="banner-close"]').click
        wait_for_xhr
      end
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
                when :esc then 27
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

    def page_status_code
      # Selenium does not support page.status_code. This is a workaround. In env 'test', we add an attribute 'code' to the <html> element.
      # Here we are checking that element to grab the response code.
      page.first('html')[:code].to_i
    end

    private

    def page
      Capybara.current_session
    end
  end
end
