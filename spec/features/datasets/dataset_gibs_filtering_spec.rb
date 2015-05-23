require 'spec_helper'

describe 'Dataset GIBS Filtering', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true
    find("h3.facet-title", text: 'Features').click
  end

  context 'when selecting the GIBS filter' do
    before :all do
      find('.facets-item', text: 'Map Imagery').click
      wait_for_xhr
    end

    it 'shows only GIBS enabled datasets' do
      expect(page).to have_css('.badge-gibs', count: 24)
    end

    context 'when un-selecting the GIBS filter' do
      before :all do
        find('.applied-facets .facets-item', text: 'Map Imagery').click
        wait_for_xhr
      end

      it 'shows all datasets' do
        expect(page).to have_css('.badge-gibs', count: 3)
      end

      it 'shows recent and featured datasets' do
        expect(page).to have_content('Recent and Featured')
      end
    end
  end

end
