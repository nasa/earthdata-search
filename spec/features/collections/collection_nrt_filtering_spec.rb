require 'spec_helper'

describe 'Collection NRT Filtering', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true
  end

  context 'when selecting the NRT filter' do
    before :all do
      find('.facets-item', text: 'Near Real Time').click
      wait_for_xhr
    end

    it 'shows only NRT collections' do
      expect(collection_results).to have_css('.badge-nrt', count: 21)
    end

    context 'when un-selecting the NRT filter' do
      before :all do
          find('p.facets-item', text: 'Near Real Time').click
        wait_for_xhr
      end

      it 'shows all collections' do
        expect(collection_results).to have_css('.badge-nrt', count: 2)
      end

      it 'shows recent and featured collections' do
        expect(collection_results).to have_content('Recent and Featured')
      end
    end
  end

end
