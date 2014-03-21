# EDSC-188 As a user, I want to view GIBS tile imagery corresponding to my
#          search area on a map so that I may preview my results
# EDSC-193 As a user, I want to see information about which datasets have GIBS
#          support so I may understand why some datasets render differently

require "spec_helper"

describe "Dataset GIBS visualizations", reset: false do

  gibs_dataset_id = 'C1000000019-LANCEMODIS'
  gibs_tile_layer = '.leaflet-tile-pane .leaflet-layer:nth-child(2)'

  before :all do
    visit "/search"
    fill_in "keywords", with: gibs_dataset_id
    expect(page).to have_content('MOD04_L2')
  end

  after :all do
    reset_search
    wait_for_xhr
  end

  context "when viewing a GIBS-enabled dataset in the results list" do
    it "indicates that the dataset has GIBS visualizations" do
      expect(first_dataset_result).to have_css('.badge-gibs')
    end
  end

  context "when visualizing a GIBS-enabled dataset" do
    before :all do
      first_dataset_result.click_link "View dataset"
    end

    after :all do
      first_dataset_result.click_link "Hide dataset"
    end

    it "displays composite GIBS imagery corresponding to the first 20 granule results on an HTML canvas" do
      within gibs_tile_layer do
        expect(page).to have_selector('canvas')
      end
    end
  end

  context "when turning off visualizations for a GIBS-enabled dataset" do
    before :all do
      first_dataset_result.click_link "View dataset"
      page.should have_css(gibs_tile_layer)
      first_dataset_result.click_link "Hide dataset"
    end

    it "removes the dataset's GIBS tiles from the map" do
      page.should have_no_css(gibs_tile_layer)
    end
  end
end
