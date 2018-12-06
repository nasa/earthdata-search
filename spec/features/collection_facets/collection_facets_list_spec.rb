require 'spec_helper'

describe 'Collection Facet Display' do
  context 'When viewing facets on before taking any actions' do
    before :all do
      Capybara.reset_sessions!

      load_page :search, facets: true
    end

    it 'expands only Features by default' do
      within '.features' do
        expect(page).to have_css('.facets-list-show', count: 1)
      end
    end

    it 'does not expand Keywords by default' do
      within '.keywords' do
        expect(page).to_not have_css('.facets-list-show')
        expect(page).to have_css('.facets-list-hide', count: 1)
      end
    end

    it 'does not expand Platforms by default' do
      within '.platforms' do
        expect(page).to_not have_css('.facets-list-show')
        expect(page).to have_css('.facets-list-hide', count: 1)
      end
    end

    it 'does not expand Instruments by default' do
      within '.instruments' do
        expect(page).to_not have_css('.facets-list-show')
        expect(page).to have_css('.facets-list-hide', count: 1)
      end
    end

    it 'does not expand Organizations by default' do
      within '.organizations' do
        expect(page).to_not have_css('.facets-list-show')
        expect(page).to have_css('.facets-list-hide', count: 1)
      end
    end

    it 'does not expand Processing levels by default' do
      within '.processing-levels' do
        expect(page).to_not have_css('.facets-list-show')
        expect(page).to have_css('.facets-list-hide', count: 1)
      end
    end

    it 'contains the hard coded facets for Features' do
      expect(page).to have_css('.facets-item', count: 3)

      expect(page).to have_css('.facets-item', text: 'Map Imagery', match: :prefer_exact)
      expect(page).to have_css('.facets-item', text: 'Near Real Time', match: :prefer_exact)
      expect(page).to have_css('.facets-item', text: 'Customizable', match: :prefer_exact)
    end

    it 'shows at least one Keywords facet' do
      find('h3.panel-title', text: 'Keywords').click

      expect(page).to have_css('.keywords label.facets-item')

      # Collapse the panel to accomodate random order in tests
      find('h3.panel-title', text: 'Keywords').click
    end

    it 'shows at least one Platforms facet' do
      find('h3.panel-title', text: 'Platforms').click

      expect(page).to have_css('.platforms label.facets-item')

      # Collapse the panel to accomodate random order in tests
      find('h3.panel-title', text: 'Platforms').click
    end

    it 'shows at least one Instruments facet' do
      find('h3.panel-title', text: 'Instruments').click

      expect(page).to have_css('.instruments label.facets-item')

      # Collapse the panel to accomodate random order in tests
      find('h3.panel-title', text: 'Instruments').click
    end

    it 'shows at least one Projects facet' do
      find('h3.panel-title', text: 'Projects').click

      expect(page).to have_css('.projects label.facets-item')

      # Collapse the panel to accomodate random order in tests
      find('h3.panel-title', text: 'Projects').click
    end

    it 'shows at least one Organizations facet' do
      find('h3.panel-title', text: 'Organizations').click

      expect(page).to have_css('.organizations label.facets-item')

      # Collapse the panel to accomodate random order in tests
      find('h3.panel-title', text: 'Organizations').click
    end

    it 'shows at least one Processing levels facet' do
      find('h3.panel-title', text: 'Processing levels').click

      expect(page).to have_css('.processing-levels label.facets-item')

      # Collapse the panel to accomodate random order in tests
      find('h3.panel-title', text: 'Processing levels').click
    end
  end
end
