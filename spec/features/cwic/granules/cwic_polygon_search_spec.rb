require 'rails_helper'

describe "CWIC-enabled polygon searches" do
  extend Helpers::CollectionHelpers

  cwic_collection_name = "EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data"

  context "when a polygon search condition has been applied" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, q: 'USGS_EDC_EO1_ALI', ac: true
      create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
      wait_for_xhr
    end

    context "viewing CWIC granule results" do
      hook_granule_results(cwic_collection_name)

      it "displays an indication that the search has been reduced to its minimum bounding rectangle" do
        expect(page).to have_selector('path[stroke-dasharray="2, 10"][stroke="#ff0000"]')
      end

      it "filters the result list based on the minimum bounding rectangle" do
        expect(page).to have_content("Showing 20")
        params = page.evaluate_script('edsc.page.project.focus().collection.granuleDatasource().toQueryParams()')
        expect(params).to have_key('mbr')
        expect(params).not_to have_key('polygon')
      end
    end

    context "viewing CWIC granule results for the first time" do
      before :all do
        Capybara.reset_sessions!
        load_page :search, q: 'USGS_EDC_EO1_ALI', ac: true
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
        wait_for_xhr

        view_granule_results(cwic_collection_name)
      end

      after :all do
        leave_granule_results
      end
    end

    context "viewing CWIC granule results after the first time" do
      before :all do
        Capybara.reset_sessions!
        load_page :search, q: 'USGS_EDC_EO1_ALI', ac: true
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
        wait_for_xhr

        view_granule_results(cwic_collection_name)
        leave_granule_results
        view_granule_results(cwic_collection_name)
      end

      after :all do
        leave_granule_results
      end

      it "presents no message explaining that the search has been reduced" do
        expect(page).not_to have_popover('Polygon Searches Unavailable')
      end
    end

    context "viewing CWIC granule results and returning to the collection search results list" do
      before :all do
        view_granule_results(cwic_collection_name)
        leave_granule_results
      end

      it "restores the original polygon search condition display" do
        expect(page).not_to have_selector('path[stroke-dasharray="2, 10"][stroke="#ff0000"]')
      end

      it "restores the original polygon search condition" do
        spatial = page.evaluate_script('edsc.page.query.spatial()')
        expect(spatial).to start_with('polygon')
      end

      it "removes messages explaining that the search has been reduced" do
        expect(page).not_to have_popover('Polygon Searches Unavailable')
      end
    end
  end

  context "viewing non-CWIC granule results" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, q: 'C14758250-LPDAAC_ECS'
      create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
      wait_for_xhr
    end

    hook_granule_results("ASTER L1A Reconstructed Unprocessed Instrument Data V003")

    it "does not display an indication that the search has been reduced to its minimum bounding rectangle" do
      expect(page).not_to have_selector('path[stroke-dasharray="2, 10"][stroke="#ff0000"]')
    end

    it "does not present a message explaining that the search has been reduced" do
      expect(page).not_to have_popover('Polygon Searches Unavailable')
    end

    it "filters the result list based on the polygon constraint" do
      params = page.evaluate_script('edsc.page.project.focus().collection.granuleDatasource().toQueryParams()')
      expect(params).not_to have_key('mbr')
      expect(params).to have_key('polygon')
    end
  end
end
