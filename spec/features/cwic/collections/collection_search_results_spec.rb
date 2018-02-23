require 'spec_helper'

describe 'CWIC-capable collection search results', reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search, ac: true
  end

  context 'in the collection results list' do
    context 'when viewing a CWIC collection' do
      before :all do
        fill_in 'keywords', with: 'C1220566654-USGS_LTA'
        wait_for_xhr
      end

      it 'shows the CWIC tagged collection' do
        expect(first_collection_result).to have_content('EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data')
      end

      it 'does not show a granule count' do
        expect(first_collection_result).to have_no_text('Granules')
      end

      it 'displays an indication that its search and retrieval is provided externally' do
        expect(first_collection_result).to have_text('Int\'l / Interagency')
      end
    end

    context 'a non-CWIC-tagged item' do
      before :all do
        fill_in 'keywords', with: 'C1000001188-LARC_ASDC'
        wait_for_xhr
      end

      it 'shows a granule count' do
        expect(first_collection_result).to have_text('Granules')
      end

      it 'displays no indication of external search and retrieval' do
        expect(first_collection_result).to have_no_text('Int\'l / Interagency')
      end
    end

    context 'collection-only collection' do
      before :all do
        fill_in 'keywords', with: 'nsidc-0051'
        wait_for_xhr
      end

      it 'doesn\'t show add to project icon' do
        expect(first_collection_result).not_to have_link('Add collection to the current project')
      end
    end
  end
end
