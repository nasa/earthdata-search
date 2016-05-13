require "spec_helper"

describe "Granule hole displays", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search
  end
  use_collection "C1000000300-NSIDC_ECS", "IceBridge Sander AIRGrav L4 Bathymetry V001"

  context "for collections whose granules have holes" do
    hook_granule_results('IceBridge Sander AIRGrav L4 Bathymetry V001')

    context "when selecting a granule" do
      before :all do
        third_granule_list_item.click
      end

      after :all do
        third_granule_list_item.click
        map_mouseout()
      end

      it "draws footprints that contain holes" do
        expect(page).to have_selector('.leaflet-overlay-pane path', count: 14)
      end
    end

    context "when mousing over a hole area" do
      before :all do
        map_mousemove('#map', 75, -40)
      end

      after :all do
        map_mouseout()
      end

      it "does not display a footprint outline" do
        expect(page).to have_no_selector('.leaflet-overlay-pane path')
      end
    end

    context "when mousing over a granule non-hole area" do
      before :all do
        map_mousemove('#map', 76, -28)
      end

      after :all do
        map_mouseout()
      end


      it "displays a footprint outline" do
        expect(page).to have_selector('.leaflet-overlay-pane path', count: 7)
      end
    end

  end
end
