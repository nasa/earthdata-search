require 'rails_helper'

describe 'CWIC-enabled collection search results' do
  context 'When viewing the collection results list' do
    context 'When viewing a CWIC collection' do
      before :all do
        Capybara.reset_sessions!

        load_page :search, q: 'C1443228137-ISRO'
      end

      it 'shows the CWIC tagged collection' do
        expect(first_collection_result).to have_content('IRS 1C LIS3 Standard Products')
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
