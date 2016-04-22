require "spec_helper"

describe "Collection visualizations", reset: false do

  collection_id = 'C179002914-ORNL_DAAC'

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

    context "when visualizing a collection that has a very small bounding box" do
      before :all do
        # load_page :search
        # fill_in "keywords", with: collection_id
        script = "$('#map').data('map').map.panTo(new L.LatLng(30, -122))"
        page.evaluate_script(script)
        wait_for_xhr
        first_collection_result.click_link "View collection"
      end

      after :all do
        first_collection_result.click_link "Hide collection"
        # reset_search
        # wait_for_xhr
      end

      it "displays a position marker in addition to the bounding box on the map" do
        expect(page).to have_css('.leaflet-marker-icon')
      end
    end

    context "when turning off visualizations for a collection that has a very small bounding box" do
      before :all do
        # load_page :search
        # fill_in "keywords", with: collection_id
        # script = "$('#map').data('map').map.panTo(new L.LatLng(30, -122))"
        # page.evaluate_script(script)
        # wait_for_xhr
        first_collection_result.click_link "View collection"
        page.should have_css('.leaflet-marker-icon')
        first_collection_result.click_link "Hide collection"
      end

      # after :all do
      #   reset_search
      #   wait_for_xhr
      # end

      it "removes the marker on the map" do
        expect(page).to have_no_css('.leaflet-marker-icon')
      end
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
