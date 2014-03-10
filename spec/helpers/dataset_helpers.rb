module Helpers
  module DatasetHelpers

    def use_dataset(id, text)
      before :all do
        fill_in "keywords", with: id
        expect(page).to have_content(text)
      end

      after :all do
        reset_search
        wait_for_xhr
      end
    end

    def hook_granule_results
      before :all do
        first_dataset_result.click
        expect(page).to have_no_text("Loading granules...")
      end

      after :all do
        find('#granule-list').click_link('Back to Datasets')
        wait_for_visualization_unload
      end
    end

    def hook_visualization
      before :all do
        first_dataset_result.click_link "View dataset"
        wait_for_visualization_load
      end

      after :all do
        first_dataset_result.click_link "Hide dataset"
        wait_for_visualization_unload
      end
    end

    def hook_visualization_removal
      before :all do
        first_dataset_result.click_link "View dataset"
        wait_for_visualization_load
        first_dataset_result.click_link "Hide dataset"
        wait_for_visualization_unload
      end
    end

    private

    def wait_for_visualization_unload
      expect(page).to have_no_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
    end

    def wait_for_visualization_load
      require "timeout"
      start = Time.now
      sleep(0.1) while page.evaluate_script('window.edsc.page.map.map.loadingLayers') != 0
      puts "(Waited #{Time.now - start}s for visualizations to load)"
    end
  end
end
