# EDSC-190 As a user, I want to see information about the accuracy of GIBS
#          information so I may understand areas where it does not precisely
#          correspond to the data I retrieve

require "spec_helper"

describe "Dataset GIBS help", reset: true do

  gibs_dataset_id = 'C1000000019-LANCEMODIS'
  gibs_tile_layer = '.leaflet-tile-pane .leaflet-layer:nth-child(2)'

  before :each do
    load_page :search
    fill_in "keywords", with: gibs_dataset_id
    expect(page).to have_content('MOD04_L2')
  end

  context "when visualizing a GIBS-enabled dataset" do
    before :each do
      first_featured_dataset.click_link "View dataset"
    end

    it "displays information on the source and accuracy of GIBS browse" do
      expect(page).to have_popover('Approximate Granule Imagery')
      within('.popover') do
        expect(page).to have_link('GIBS')
      end
    end
  end

  context "when visualizing a GIBS-enabled dataset a second time" do
    before :each do
      first_featured_dataset.click_link "View dataset"
      within '.popover-navigation' do
        click_on 'Close'
      end
      page.should have_css(gibs_tile_layer)
      first_featured_dataset.click_link "Hide dataset"
      page.should have_no_css(gibs_tile_layer)
      first_featured_dataset.click_link "View dataset"
      page.should have_css(gibs_tile_layer)
    end

    it "does not display GIBS accuracy information a second time" do
      expect(page).to have_no_popover('Approximate Granule Imagery')
    end
  end
end
