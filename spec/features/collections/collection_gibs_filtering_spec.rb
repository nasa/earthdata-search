require 'spec_helper'

describe 'Collection GIBS Filtering', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true, env: :sit
    
  end

  context 'when selecting the GIBS filter' do
    before :all do
      find('p.facets-item', text: 'Map Imagery').click
      wait_for_xhr
    end

    it 'shows only GIBS enabled collections' do
      expect(page).to have_css('.badge-gibs', count: 21)
    end

    context 'when un-selecting the GIBS filter' do
      before :all do
        find('p.facets-item', text: 'Map Imagery').click
        wait_for_xhr
      end

      it 'shows all collections' do
        expect(page).to have_css('.badge-gibs', count: 1)
      end

      # The hard-coded feature collection ids in collection_extra is for ops only.
      xit 'shows recent and featured collections' do
        expect(page).to have_content('Recent and Featured')
      end
    end
  end

end
