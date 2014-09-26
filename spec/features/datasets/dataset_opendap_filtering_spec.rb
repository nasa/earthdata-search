require 'spec_helper'

describe 'Dataset OPeNDAP Filtering', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true
  end

  context 'when selecting the OPeNDAP filter' do
    before :all do
      click_link 'Features'
      find('.facets-item', text: 'Subsetting Services').click
      wait_for_xhr
    end

    it 'shows only OPeNDAP enabled datasets' do
      expect(page).to have_css('.badge-opendap', count: 22)
    end

    context 'when un-selecting the OPeNDAP filter' do
      before :all do
        find('.applied-facets .facets-item', text: 'Subsetting Services').click
        wait_for_xhr
      end

      it 'shows all datasets' do
        expect(page).to have_css('.badge-opendap', count: 1)
      end

      it 'shows recent and featured datasets' do
        expect(page).to have_content('Recent and Featured')
      end
    end
  end

end
