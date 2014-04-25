module Helpers
  module DatasetHelpers
    def use_dataset(id, text)
      before :all do
        fill_in "keywords", with: id
        expect(first_dataset_result).to have_content(text)
        wait_for_xhr
      end

      after :all do
        reset_search
        wait_for_xhr
      end
    end

    def view_granule_results(from='dataset-results')
      expect(page).to have_visible_overlay(from)
      page.execute_script("$('##{from} .panel-list-item:first-child').click()")
      #item.click # This causes intermittent failures based on timing
      wait_for_xhr
      wait_for_visualization_load
      expect(page).to have_visible_granule_list
    rescue => e
      Capybara::Screenshot.screenshot_and_save_page
      puts "Visible overlay: #{OverlayUtil::current_overlay_id(page)}"
      raise e
    end

    def leave_granule_results(to='dataset-results')
      expect(page).to have_visible_granule_list
      page.execute_script("$('#granule-list a.master-overlay-back').click()")
      #find('#granule-list').click_link('Back to Datasets')
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
      synchronize(120) do
        expect(page.evaluate_script('edsc.page.map.map.loadingLayers')).to eql(0)
      end
    end
  end
end
