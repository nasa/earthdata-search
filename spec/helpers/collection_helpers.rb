module Helpers
  module CollectionHelpers
    def use_collection(id, text)
      before :all do
        wait_for_xhr
        fill_in "keywords", with: id
        wait_for_xhr
        expect(first_collection_result).to have_content(text)
      end

      after :all do
        reset_search
        wait_for_xhr
      end
    end

    def for_collapsed_collection(id, text)
      wait_for_xhr
      fill_in "keywords", with: id
      wait_for_xhr
      expect(first_collapsed_collection).to have_content(text)
      yield
      reset_search
      wait_for_xhr
    end

    def view_granule_results(from='collection-results')
      wait_for_xhr
      expect(page).to have_visible_overlay(from)
      root = from
      root = 'collection-results-list' if root == 'collection-results'
      page.execute_script("$('##{root} .panel-list-item:first-child').click()")
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

    def hook_granule_results(scope=:all)
      before(scope) { view_granule_results }
      after(scope) { leave_granule_results }
    end

    def hook_granule_results_back
      before :all do
        view_granule_results
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
