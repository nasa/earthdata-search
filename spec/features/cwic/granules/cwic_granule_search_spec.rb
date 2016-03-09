require "spec_helper"

describe "CWIC-enabled polygon searches", reset: false do
  extend Helpers::CollectionHelpers

  cwic_collection_name = "EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data"

  context "when a polygon search condition has been applied" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :uat, ff: "Int'l / Interagency", q: 'USGS_EDC_EO1_ALI'
      create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
    end

    context "viewing CWIC granule results" do
      hook_granule_results(cwic_collection_name)

      it "displays an indication that the search has been reduced to its minimum bounding rectangle", acceptance: true do
        expect(page).to have_selector('path[stroke-dasharray="2, 10"][stroke="#ff0000"]')
      end
    end

    context "viewing CWIC granule results for the first time" do
      before :all do
        Capybara.reset_sessions!
        load_page :search, env: :uat, ff: "Int'l / Interagency", q: 'USGS_EDC_EO1_ALI'
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])

        view_granule_results(cwic_collection_name)
      end

      after :all do
        leave_granule_results
      end

      it "presents a message explaining that the search has been reduced", acceptance: true do
        expect(page).to have_popover('Polygon Searches Unavailable')
        within '.popover' do
          expect(page).to have_content("Search results will show all granules within your area's minimum bounding rectangle")
        end
      end
    end

    context "viewing CWIC granule results after the first time" do
      before :all do
        Capybara.reset_sessions!
        load_page :search, env: :uat, ff: "Int'l / Interagency", q: 'USGS_EDC_EO1_ALI'
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])

        view_granule_results(cwic_collection_name)
        leave_granule_results
        view_granule_results(cwic_collection_name)
      end

      after :all do
        leave_granule_results
      end

      it "presents no message explaining that the search has been reduced", acceptance: true do
        expect(page).not_to have_popover('Polygon Searches Unavailable')
      end
    end

    context "viewing CWIC granule results and returning to the collection search results list" do
      before :all do
        view_granule_results(cwic_collection_name)
        leave_granule_results
      end

      it "restores the original polygon search condition display", acceptance: true do
        expect(page).not_to have_selector('path[stroke-dasharray="2, 10"][stroke="#ff0000"]')
      end

      it "removes messages explaining that the search has been reduced", acceptance: true do
        expect(page).not_to have_popover('Polygon Searches Unavailable')
      end
    end
  end

  context "viewing non-CWIC granule results" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, q: 'C179003030-ORNL_DAAC'
      create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
    end

    hook_granule_results("15 Minute Stream Flow Data: USGS (FIFE)")

    it "does not display an indication that the search has been reduced to its minimum bounding rectangle", acceptance: true do
      expect(page).not_to have_selector('path[stroke-dasharray="2, 10"][stroke="#ff0000"]')
    end

    it "does not present a message explaining that the search has been reduced", acceptance: true do
      expect(page).not_to have_popover('Polygon Searches Unavailable')
    end
  end
end
