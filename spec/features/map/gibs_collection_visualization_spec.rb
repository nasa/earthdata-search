require 'rails_helper'

describe 'Collection GIBS visualizations' do
  extend Helpers::CollectionHelpers

  gibs_collection_id = 'C1443528505-LAADS'

  context 'when viewing a GIBS-enabled collection in the results list' do
    before do
      load_page :search
      fill_in 'keywords', with: gibs_collection_id
      wait_for_xhr
    end

    it 'indicates that the collection has GIBS visualizations' do
      expect(first_collection_result).to have_css('.badge-gibs')
    end
  end

  context 'when visualizing a GIBS-enabled collection' do
    before :all do
      load_page :search
      fill_in 'keywords', with: gibs_collection_id
      wait_for_xhr
      first_collection_result.click
      wait_for_xhr
    end

    it 'displays composite GIBS imagery corresponding to the first 20 granule results on an HTML canvas' do
      expect(page).to have_granule_visualizations(gibs_collection_id)
    end

    context 'when turning off visualizations for a GIBS-enabled collection' do
      before do
        click_on 'Back to Collections'
      end

      it "removes the collection's GIBS tiles from the map" do
        expect(page).to have_no_granule_visualizations(gibs_collection_id)
      end
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

    it 'displays the correct geo resolution' do
      # expect(page).to have_gibs_resolution('1km')
      expect(page).to have_gibs_resolution('2km')
    end

    context 'when selecting the arctic resolution' do
      before do
        find('.projection-switcher-arctic').click
      end

      it 'displays the correct arctic resolution' do
        expect(page).to have_gibs_resolution('1km')
      end
    end
  end
end
