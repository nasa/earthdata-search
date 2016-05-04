require "spec_helper"

describe "CWIC-enabled granule visualizations", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search, q: 'C1220566654-USGS_LTA'
  end

  context do
    hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

    context "viewing CWIC granule results with available browse imagery" do
      it "displays browse thumbnails for each granule with browse", acceptance: true do
        expect(granule_list).to have_css('a.panel-list-thumbnail-container img[src*="/browse/eo-1/ali/"]')
      end
    end

    context "selecting a CWIC granule result with available browse imagery" do
      before :all do
        first_granule_list_item.click
      end

      after :all do
        first_granule_list_item.click
      end

      it "displays a larger preview of the browse data", acceptance: true do
        expect(page).to have_css('#map .granule-browse a img[src*="/browse/eo-1/ali/"]', visible: false)
      end

      context "clicking on the browse preview" do
        it "opens the full-size browse in a new tab", acceptance: true do
          link = find('#map .granule-browse a', visible: false)
          expect(link['target']).to eq("_blank")
        end
      end
    end
  end

  context "when viewing CWIC granule results" do
    hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

    it "displays spatial footprints for the granules", acceptance: true do
      expect(page).to have_granule_visualizations('C1220566654-USGS_LTA')
    end

    context "clicking on a granule in the list" do
      before :all do
        first_granule_list_item.click
      end

      it "draws the granule on the map" do
        expect(page).to have_selector('#map path', count: 4)
      end

      it "draws the granule's temporal extent on the map" do
        expect(page).to have_selector('.granule-spatial-label-temporal', count: 1)
      end
    end

  end
end
