require "spec_helper"

describe "CWIC-enabled granule results", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search, q: 'C1220566654-USGS_LTA'
  end

  after :each do
    clear_spatial
    wait_for_xhr
  end

  context "for CWIC-tagged collections" do
    hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

    context "performing a granule search with a point condition applied using the standard interface" do
      before(:all) do
        create_point(40, -75)
        wait_for_xhr
      end

      it "filters the results list to matching granules", acceptance: true do
        expect(page).to have_content("Showing 1 of 1 matching granule")
      end

    end

    context "removing a point condition from a granule search" do
      before(:all) do
        create_point
        wait_for_xhr
        clear_spatial
        wait_for_xhr
      end

      it "updates the results list with the new filter", acceptance: true do
        expect(page.text).to match(/Showing \d{2,} of \d{2,} matching granules/)
      end
    end

    context "performing a granule search with a bounding box condition applied using the standard interface" do
      before(:all) do
        create_bounding_box(40, -75, 41, -74)
        wait_for_xhr
      end
      it "filters the results list to matching granules", acceptance: true do
        expect(page.text).to match(/Showing 20 of \d{2} matching granules/)
      end
    end

    context "removing a bounding box condition from a granule search" do
      before(:all) do
        create_bounding_box(40, -75, 41, -74)
        wait_for_xhr
        clear_spatial
        wait_for_xhr
      end

      it "updates the results list with the new filter", acceptance: true do
        expect(page.text).to match(/Showing 20 of \d{3,} matching granules/)
      end
    end
  end
end
