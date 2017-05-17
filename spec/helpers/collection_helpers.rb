module Helpers
  module CollectionHelpers
    def use_collection(id, text)
      before :all do
        dismiss_banner
        wait_for_xhr
        fill_in "keywords", with: id
        wait_for_xhr
        expect(find('#collection-results .panel-list-item:first-child, #collection-results .ccol:first-child')).to have_content(text)
      end

      after :all do
        reset_search
        wait_for_xhr
      end
    end

    def view_granule_filters(col_name='15 Minute Stream Flow Data: USGS (FIFE)')
      find_by_id("project-collections-list").find("h3", :text => col_name, :exact => true).find(:xpath, '../..').find_link('Show granule filters').trigger("click")
      wait_for_xhr
    end

    def view_granule_results(col_name='15 Minute Stream Flow Data: USGS (FIFE)', from='collection-results')
      wait_for_xhr
      overlay = from
      overlay = 'collection-results' if overlay == 'collection-featured-list'
      expect(page).to have_visible_overlay(overlay)
      root = from
      root = 'collection-results-list' if root == 'collection-results'
      page.execute_script("$('##{root} .panel-list-item:contains(\"#{col_name}\")').click()")
      #item.click # This causes intermittent failures based on timing
      wait_for_xhr
      wait_for_visualization_load
      expect(page).to have_visible_granule_list
    rescue => e
      Capybara::Screenshot.screenshot_and_save_page
      puts "Visible overlay: #{OverlayUtil::current_overlay_id(page)}"
      raise e
    end

    def leave_granule_results(to='collection-results')
      wait_for_xhr
      expect(page).to have_visible_granule_list
      page.execute_script("$('#granule-list a.master-overlay-back').click()")
      #find('#granule-list').click_link('Back to Collections')
      wait_for_xhr
      wait_for_visualization_unload
      expect(page).to have_visible_overlay(to)
    rescue => e
      Capybara::Screenshot.screenshot_and_save_page
      puts "Visible overlay: #{OverlayUtil::current_overlay_id(page)}"
      raise e
    end

    def add_to_project(col_name)
      wait_for_xhr
      page.execute_script("$('#collection-results-list .panel-list-item:contains(\"#{col_name}\") a.add-to-project').click()")
      wait_for_xhr
    end

    def hook_granule_results(col_name='15 Minute Stream Flow Data: USGS (FIFE)', scope=:all, from='collection-results')
      before(scope) { view_granule_results(col_name, from) }
      after(scope) { leave_granule_results }
    end

    def hook_granule_results_back(col_name='15 Minute Stream Flow Data: USGS (FIFE)')
      before :all do
        view_granule_results(col_name)
        leave_granule_results
      end
    end

    private

    def wait_for_visualization_unload
      expect(page).to have_no_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
    end

    def wait_for_visualization_load
      #synchronize(120) do
      #  expect(page.evaluate_script('edsc.page.map.map.loadingLayers')).to eql(0)
      #end
    end
  end
end
