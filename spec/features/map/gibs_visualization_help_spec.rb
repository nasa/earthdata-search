# EDSC-190 As a user, I want to see information about the accuracy of GIBS
#          information so I may understand areas where it does not precisely
#          correspond to the data I retrieve

require "spec_helper"

describe "Collection GIBS help", reset: true do
  extend Helpers::CollectionHelpers

  gibs_collection_id = 'C119124186-NSIDC_ECS'
  gibs_collection_name = 'AMSR-E/Aqua L2B Global Swath Rain Rate/Type GSFC Profiling Algorithm V002'
  gibs_tile_layer = '.leaflet-tile-pane .leaflet-layer:nth-child(2)'

  before :each do
    load_page :search
    fill_in "keywords", with: gibs_collection_id
    expect(page).to have_content('AE_Rain')
  end

  context "when visualizing a GIBS-enabled collection" do
    hook_granule_results(gibs_collection_name, :each)

    it "displays information on the source and accuracy of GIBS browse" do
      expect(page).to have_popover('Approximate Granule Imagery')
      within('.popover') do
        expect(page).to have_link('GIBS')
      end
    end
  end

  context "when visualizing a GIBS-enabled collection a second time" do
    before :each do
      view_granule_results(gibs_collection_name)
      within '.popover-navigation' do
        click_on 'Close'
      end
      expect(page).to have_granule_visualizations(gibs_collection_id)
      leave_granule_results
      expect(page).to have_no_granule_visualizations(gibs_collection_id)
      view_granule_results(gibs_collection_name)
      expect(page).to have_granule_visualizations(gibs_collection_id)
    end

    it "does not display GIBS accuracy information a second time" do
      expect(page).to have_no_popover('Approximate Granule Imagery')
    end
  end
end
