require 'spec_helper'

describe 'Dataset GIBS Filtering', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true
  end

  context 'when selecting the GIBS filter' do
    before :all do
      check 'GIBS Imagery'
      wait_for_xhr
    end

    it 'shows only GIBS enabled datasets' do
      expect(page).to have_css('.badge-gibs', count: 22)
    end

    context 'when un-selecting the GIBS filter' do
      before :all do
        uncheck 'GIBS Imagery'
        wait_for_xhr
      end

      it 'shows all datasets' do
        expect(page).to have_css('.badge-gibs', count: 2)
      end

      it 'shows recent and featured datasets' do
        expect(page).to have_content('Recent and Featured')
      end
    end
  end

end
