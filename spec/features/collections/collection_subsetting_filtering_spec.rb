require 'spec_helper'

describe 'Collection "Subsetting Services" Filtering', reset: false do
  before :all do
    Capybara.reset_sessions!
  end

  context 'when a collection search result has ESI subsetting' do
    before :all do
      load_page :search, q: 'C179014697-NSIDC_ECS'
    end

    it 'displays the subsetting badge on the collection' do
      expect(first_collection_result).to have_css('.badge-subsetting', count: 1)
    end
  end

  context 'when a collection search result has OPeNDAP subsetting' do
    before :all do
      load_page :search, q: 'C128599377-NSIDC_ECS'
    end

    it 'displays the subsetting badge on the collection' do
      expect(first_collection_result).to have_css('.badge-subsetting', count: 1)
    end
  end

  context 'when a collection search result has no subsetting' do
    before :all do
      load_page :search, q: 'C179002726-ORNL_DAAC'
    end

    it 'displays the subsetting badge on the collection' do
      expect(first_collection_result).to have_no_css('.badge-subsetting')
    end
  end

  context 'when selecting the "Subsetting Services" filter' do
    before :all do
      load_page :search, facets: true
      find('.facets-item', text: 'Subsetting Services').click
      wait_for_xhr
    end

    it 'shows only subsetting-enabled collections' do
      expect(page).to have_css('.badge-subsetting', count: 21)
    end

    context 'when un-selecting the "Subsetting Services" filter' do
      before :all do
        find('p.facets-item', text: 'Subsetting Services').click
        wait_for_xhr
      end

      it 'shows all collections' do
        expect(page).to have_css('.badge-subsetting', count: 1)
      end

      it 'shows recent and featured collections' do
        expect(page).to have_content('Recent and Featured')
      end
    end
  end

end
