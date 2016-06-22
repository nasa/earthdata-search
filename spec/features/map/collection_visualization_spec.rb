require "spec_helper"

describe "Collection visualizations", reset: false do
  extend Helpers::CollectionHelpers

  collection_id = 'C179002914-ORNL_DAAC'
  collection_name = '30 Minute Rainfall Data (FIFE)'

  context "on collection list page" do
    before :all do
      load_page :search
      fill_in "keywords", with: collection_id
      # script = "$('#map').data('map').map.panTo(new L.LatLng(30, -122))"
      # page.evaluate_script(script)
      wait_for_xhr
    end

    after :all do
      reset_search
      wait_for_xhr
    end

    context "when clicking on 'View collection details' button" do
      before :all do
        # load_page :search
        # fill_in "keywords", with: collection_id
        # wait_for_xhr
        first_collection_result.click_link "View collection details"
      end

      after :all do
        load_page :search
        fill_in "keywords", with: collection_id
        wait_for_xhr
      end

      it "displays a position marker on the mini map but not the map layer" do
        within "#collection-details" do
          expect(page).to have_css('.leaflet-marker-icon')
        end

        within "#map" do
          expect(page).to have_no_css('.leaflet-marker-icon')
        end
      end

    end
  end


end
