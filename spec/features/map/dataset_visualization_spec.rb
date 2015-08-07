require "spec_helper"

describe "Dataset visualizations", reset: false do

  dataset_id = 'C179002914-ORNL_DAAC'

  context "on dataset list page" do
    before :all do
      load_page :search
      fill_in "keywords", with: dataset_id
      # script = "$('#map').data('map').map.panTo(new L.LatLng(30, -122))"
      # page.evaluate_script(script)
      wait_for_xhr
    end

    after :all do
      reset_search
      wait_for_xhr
    end

    context "when visualizing a dataset that has a very small bounding box" do
      before :all do
        # load_page :search
        # fill_in "keywords", with: dataset_id
        script = "$('#map').data('map').map.panTo(new L.LatLng(30, -122))"
        page.evaluate_script(script)
        wait_for_xhr
        first_dataset_result.click_link "View dataset"
      end

      after :all do
        first_dataset_result.click_link "Hide dataset"
        # reset_search
        # wait_for_xhr
      end

      it "displays a position marker in addition to the bounding box on the map" do
        expect(page).to have_css('.leaflet-marker-icon')
      end
    end

    context "when turning off visualizations for a dataset that has a very small bounding box" do
      before :all do
        # load_page :search
        # fill_in "keywords", with: dataset_id
        # script = "$('#map').data('map').map.panTo(new L.LatLng(30, -122))"
        # page.evaluate_script(script)
        # wait_for_xhr
        first_dataset_result.click_link "View dataset"
        page.should have_css('.leaflet-marker-icon')
        first_dataset_result.click_link "Hide dataset"
      end

      # after :all do
      #   reset_search
      #   wait_for_xhr
      # end

      it "removes the marker on the map" do
        expect(page).to have_no_css('.leaflet-marker-icon')
      end
    end

    context "when clicking on 'View dataset details' button" do
      before :all do
        # load_page :search
        # fill_in "keywords", with: dataset_id
        # wait_for_xhr
        first_dataset_result.click_link "View dataset details"
      end

      after :all do
        load_page :search
        fill_in "keywords", with: dataset_id
        wait_for_xhr
      end

      it "displays a position marker on both mini map and the map layer" do
        within "#dataset-details" do
          expect(page).to have_css('.leaflet-marker-icon')
        end

        within "#map" do
          expect(page).to have_css('.leaflet-marker-icon')
        end
      end

    end
  end


end
