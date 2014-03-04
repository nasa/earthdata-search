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

    def hook_visualization
      before :all do
        first_dataset_result.click_link "View dataset"
        expect(page).to have_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end

      after :all do
        first_dataset_result.click_link "Hide dataset"
        expect(page).to have_no_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end
    end

    def hook_visualization_removal
      before :all do
        first_dataset_result.click_link "View dataset"
        expect(page).to have_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
        first_dataset_result.click_link "Hide dataset"
        expect(page).to have_no_selector('.leaflet-tile-pane .leaflet-layer:nth-child(2) canvas')
      end
    end
  end
end
