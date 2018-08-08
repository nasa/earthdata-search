require 'spec_helper'

describe 'CWIC-enabled collection search results', reset: false, pending_updates: true do
  context 'When viewing the collection results list' do
    context 'When viewing a CWIC collection' do
      before :all do
        Capybara.reset_sessions!

        # This is not a CWIC collection but this functionality is only
        # in SIT at the time of writing this feature/test so we tagged
        # a collection in SIT to test it.

        # TODO: This collection has been updated and lost the tag :facepalm:
        # The new collection id is C1000001170-DEV07
        load_page :search, q: 'C1000000575-DEV07', env: :sit
      end

      it 'shows the CWIC tagged collection' do
        expect(first_collection_result).to have_content('AMSR-E/Aqua 5-Day L3 Global Snow Water Equivalent EASE-Grids V001')
      end

      it 'does not show a granule count' do
        expect(first_collection_result).to have_no_text('Granules')
      end

      it 'displays an indication that its search and retrieval is provided externally' do
        expect(first_collection_result).to have_text('Int\'l / Interagency')
      end
    end

    context 'When viewing a non CWIC-tagged item' do
      before :all do
        Capybara.reset_sessions!
        
        load_page :search, q: 'C1000001188-LARC_ASDC'
      end

      it 'shows a granule count' do
        expect(first_collection_result).to have_text('Granules')
      end

      it 'displays no indication of external search and retrieval' do
        expect(first_collection_result).to have_no_text('Int\'l / Interagency')
      end
    end
  end
end
