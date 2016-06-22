require 'spec_helper'

describe 'Collection Colormaps', reset: false do
  gibs_collection_id = 'C119124186-NSIDC_ECS'
  non_gibs_collection_id = 'C179003030-ORNL_DAAC'
  gibs_granules_collection_id = 'C187016591-LPDAAC_ECS'

  before :all do
    load_page :search
  end

  context "when viewing a GIBS-enabled collection" do
    before :all do
      # load_page :search
      fill_in 'keywords', with: gibs_collection_id
      wait_for_xhr
      expect(page).to have_content("AE_Rain")
      first_collection_result.click
      wait_for_xhr
    end

    after :all do
      reset_search
    end

    it "shows the GIBS colormap" do
      expect(page).to have_css(".legend.leaflet-control")
    end

    context "when returning to the collection results" do
      before :all do
        click_link 'Back to Collections'
      end

      it "removes the colormap" do
        expect(page).to have_no_css(".legend.leaflet-control")
      end
    end
  end

  context "when viewing a non-GIBS-enabled collection" do
    before :all do
      # load_page :search
      fill_in 'keywords', with: non_gibs_collection_id
      wait_for_xhr
      expect(page).to have_content("doi:10.3334/ORNLDAAC/1")
      first_collection_result.click
      wait_for_xhr
    end

    after :all do
      click_link 'Back to Collections'
      reset_search
    end

    it "does not show a colormap" do
      expect(page).to have_no_css(".legend.leaflet-control")
    end

  end

  context "when viewing the GIBS-granule test collection" do
    before :all do
      # load_page :search
      fill_in 'keywords', with: gibs_granules_collection_id
      wait_for_xhr
      expect(page).to have_content("MOD11_L2")
      first_collection_result.click
      wait_for_xhr
    end

    it "shows the GIBS colormap" do
      expect(page).to have_css(".legend.leaflet-control")
    end

    after :all do
      click_link 'Back to Collections'
      reset_search
    end
  end
end
