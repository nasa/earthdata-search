# EDSC-27 As a user, I want to search for collections coinciding with the point
#         location of another collection so that I may limit my results to my
#         area of interest

require "spec_helper"

describe "Spatial search by collection location" do
  let(:location_link_text) { "Search using this collection's location" }

  before do
    load_page :search
    wait_for_xhr
    fill_in "keywords", with: 'C179003030-ORNL_DAAC'
    wait_for_xhr
  end

  context "for collections with point spatial" do
    it "displays a button to search using the collection's location" do
      expect(page).to have_link(location_link_text)
    end

    context "when choosing to view the collection's location" do
      before do
        click_link location_link_text
        wait_for_xhr
      end

      it "places a point spatial constraint on the map" do
        expect(page).to have_css('#map .leaflet-marker-icon')
      end

      it "highlights the collection's location link" do
        expect(page).to have_css('.button-active .fa-map-marker')
      end

      it "centers the map over the selected granule" do
        expect(page).to match_map_center(39, -97)
      end

      it "zooms the map to the selected granule" do
        script = "$('#map').data('map').map.getZoom()"
        result = page.evaluate_script script

        expect(result).to eq(8)
      end
    end

    context "when removing a collection's location link" do
      before do
        click_link location_link_text
        expect(page).to have_css('#map .leaflet-marker-icon')
        click_link location_link_text
      end

      it "removes the spatial constraint from the map" do
        expect(page).to have_no_css('#map .leaflet-marker-icon')
      end

      it "removes highlights from the collection's location link" do
        expect(page).to have_no_css('.button-active .fa fa-map-marker')
      end
    end
  end

  context "for collections without point spatial" do
    it "displays no button to search using the collection's location" do
      fill_in "keywords", with: "AST_L1A"
      expect(page).to have_no_link(location_link_text)
    end
  end
end
