# EDSC-27 As a user, I want to search for datasets coinciding with the point
#         location of another dataset so that I may limit my results to my
#         area of interest

require "spec_helper"

describe "Spatial search by dataset location" do
  let(:location_link_text) { "Search using this dataset's location" }

  before do
    load_page :search
  end

  context "for datasets with point spatial" do
    it "displays a button to search using the dataset's location" do
      expect(page).to have_link(location_link_text)
    end

    context "when choosing to view the dataset's location" do
      before do
        click_link location_link_text
      end

      it "places a point spatial constraint on the map" do
        expect(page).to have_css('#map .leaflet-marker-icon')
      end

      it "highlights the dataset's location link" do
        expect(page).to have_css('.button-active .edsc-icon-location')
      end
    end

    context "when removing a dataset's location link" do
      before do
        click_link location_link_text
        expect(page).to have_css('#map .leaflet-marker-icon')
        click_link location_link_text
      end

      it "removes the spatial constraint from the map" do
        expect(page).to have_no_css('#map .leaflet-marker-icon')
      end

      it "removes highlights from the dataset's location link" do
        expect(page).to have_no_css('.button-active .edsc-icon-location')
      end
    end
  end

  context "for datasets without point spatial" do
    it "displays no button to search using the dataset's location" do
      fill_in "keywords", with: "AST_L1A"
      expect(page).to have_no_link(location_link_text)
    end
  end
end
