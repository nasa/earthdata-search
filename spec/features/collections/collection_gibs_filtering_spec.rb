require 'spec_helper'

describe 'Collection GIBS Filtering', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true
  end

  context 'when selecting the GIBS filter' do
    before :all do
      find('p.facets-item', text: 'Map Imagery').click
      wait_for_xhr
    end

    it 'shows only GIBS enabled collections' do
      expect(page).to have_css('.badge-gibs', count: 23)
    end

    context 'when un-selecting the GIBS filter' do
      before :all do
        find('p.facets-item', text: 'Map Imagery').click
        wait_for_xhr
      end

      it 'shows all collections' do
        expect(page).to have_css('.badge-gibs', count: 3)
      end

      it 'shows recent and featured collections' do
        expect(page).to have_content('Recent and Featured')
      end
    end
  end

end
