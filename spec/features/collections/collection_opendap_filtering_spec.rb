require 'spec_helper'

describe 'Collection OPeNDAP Filtering', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true
  end

  context 'when selecting the OPeNDAP filter' do
    before :all do
      find('.facets-item', text: 'Subsetting Services').click
      wait_for_xhr
    end

    it 'shows only OPeNDAP enabled collections' do
      expect(page).to have_css('.badge-opendap', count: 21)
    end

    context 'when un-selecting the OPeNDAP filter' do
      before :all do
        find('p.facets-item', text: 'Subsetting Services').click
        wait_for_xhr
      end

      it 'shows all collections' do
        expect(page).to have_css('.badge-opendap', count: 1)
      end

      it 'shows recent and featured collections' do
        expect(page).to have_content('Recent and Featured')
      end
    end
  end

end
