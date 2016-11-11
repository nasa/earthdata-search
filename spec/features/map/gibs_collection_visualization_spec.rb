# EDSC-188 As a user, I want to view GIBS tile imagery corresponding to my
#          search area on a map so that I may preview my results
# EDSC-193 As a user, I want to see information about which collections have GIBS
#          support so I may understand why some collections render differently

require "spec_helper"

describe "Collection GIBS visualizations", reset: false do
  extend Helpers::CollectionHelpers

  gibs_collection_id = 'C119124186-NSIDC_ECS'
  gibs_collection_name = 'AMSR-E/Aqua L2B Global Swath Rain Rate/Type GSFC Profiling Algorithm V002'
  gibs_tile_layer = '.leaflet-tile-pane .leaflet-layer:nth-child(2)'

  before :all do
    load_page :search
    fill_in "keywords", with: gibs_collection_id
    expect(page).to have_content('AE_Rain')
  end

  after :all do
    reset_search
    wait_for_xhr
  end

  context "when viewing a GIBS-enabled collection in the results list" do
    it "indicates that the collection has GIBS visualizations" do
      expect(first_collection_result).to have_css('.badge-gibs')
    end
  end

  context "when visualizing a GIBS-enabled collection" do
    hook_granule_results(gibs_collection_name)

    it "displays composite GIBS imagery corresponding to the first 20 granule results on an HTML canvas" do
      expect(page).to have_granule_visualizations(gibs_collection_id)
    end
  end

  context "when turning off visualizations for a GIBS-enabled collection" do
    hook_granule_results_back(gibs_collection_name)

    it "removes the collection's GIBS tiles from the map" do
      expect(page).to have_no_granule_visualizations(gibs_collection_id)
    end
  end

  context 'when viewing a GIBS-enabled collection with different resolutions for each projection' do
    before :all do
      load_page :search, env: :sit
      fill_in 'keywords', with: 'C1000001002-EDF_OPS'
      wait_for_xhr
      first_collection_result.click
      wait_for_xhr
    end

    after :all do
      load_page :search
      fill_in "keywords", with: gibs_collection_id
      wait_for_xhr
    end

    it 'displays the correct geo resolution' do
      expect(page).to have_gibs_resolution('2km')
    end

    context 'when selecting the arctic resolution' do
      before :all do
        find('.projection-switcher-arctic').click
      end

      it 'displays the correct arctic resolution' do
        expect(page).to have_gibs_resolution('1km')
      end
    end
  end
end
