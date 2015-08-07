
require "spec_helper"

describe "Dataset visualizations", reset: false do

  dataset_id = 'C179002914-ORNL_DAAC'

  before :all do
    load_page :search
    script = "$('#map').data('map').map.panTo(new L.LatLng(30, -122))"
    page.evaluate_script(script)
    fill_in "keywords", with: dataset_id
    expect(page).to have_content('30 Minute Rainfall Data (FIFE)')
    wait_for_xhr
  end

  after :all do
    reset_search
    wait_for_xhr
  end

  context "when visualizing a dataset that has a very small bounding box" do
    before :all do
      first_dataset_result.click_link "View dataset"
    end

    after :all do
      first_dataset_result.click_link "Hide dataset"
    end

    it "displays a position marker in addition to the bounding box on the map" do
      expect(page).to have_css('.leaflet-marker-icon')
    end
  end

  context "when turning off visualizations for a dataset that has a very small bounding box" do
    before :all do
      first_dataset_result.click_link "View dataset"
      page.should have_css('.leaflet-marker-icon')
      first_dataset_result.click_link "Hide dataset"
    end

    it "removes the marker on the map" do
      expect(page).to have_no_css('.leaflet-marker-icon')
    end
  end
end
