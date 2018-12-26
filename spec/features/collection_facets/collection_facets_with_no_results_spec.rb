require 'rails_helper'

describe 'Collection Facets With No Results' do
  before :all do
    Capybara.reset_sessions!

    load_page :search, facets: true
  end

  after :each do
    # Clears any selected facets to accomodate random order of tests
    reset_search

    # Reset the facet category toggling
    reset_facet_ui
  end

  context 'When selecting facets that result in empty categories' do
    it 'hides empty facet lists' do
      # Ensure that Instruments is shown
      expect(page).to have_css('.instruments .panel-heading')

      # Select a Keyword that will cause Instruments to disappear
      find('h3.panel-title', text: 'Keywords').click
      find('.keywords .facets-item', text: 'Earth Observation Satellites').click

      # Ensure that empty facet category is no longer displayed
      expect(page).to have_no_css('.instruments .panel-heading')
    end
  end

  context 'When selecting facets that result in empty facets' do
    it 'updates facet lists' do
      # Check for the existence of a facet we expect to be hidden
      find('h3.panel-title', text: 'Projects').click
      within(:css, '.projects') do
        expect(page).to have_content('2013_AN_NASA')
      end

      # Select a facet that results in other facets being empty
      find('h3.panel-title', text: 'Platforms').click
      find('.platforms .facets-item', text: 'Aqua', match: :prefer_exact).click
      wait_for_xhr

      # Collapse the category to ensure webkit can see the Projects category
      find('h3.panel-title', text: 'Platforms').click

      # Ensure that the empty facet is no longer dislpayed
      within(:css, '.projects') do
        expect(page).to have_no_content('2013_AN_NASA')
      end
    end
  end

  context 'When searching for keywords that will yeild no results' do
    context 'When one facet is selected' do
      before :all do
        find('h3.panel-title', text: 'Keywords').click
        find('.keywords .facets-item', text: 'Atmosphere', match: :prefer_exact).click

        fill_in :keywords, with: 'somestringthatmatchesnocollections'
        wait_for_xhr
      end

      it 'displays the selected facet and empty result count' do
        within '.keywords .panel-body.facets' do
          expect(page).to have_content("Atmosphere\n0")
        end
      end
    end

    context 'When two facets are selected' do
      before :all do
        find('h3.panel-title', text: 'Keywords').click

        within '.keywords' do
          find('.facets-item', text: 'Atmosphere', match: :prefer_exact).click
          wait_for_xhr

          find('.facets-item', text: 'Cryosphere', match: :prefer_exact).click
          wait_for_xhr

          find('.facets-item', text: 'Oceans', match: :prefer_exact).click
          wait_for_xhr
        end

        fill_in :keywords, with: 'somestringthatmatchesnocollections'
        wait_for_xhr
      end

      it 'displays the selected facets and empty result count' do
        within '.keywords .panel-body.facets' do
          expect(page).to have_text("Cryosphere\n0\nOceans\n0\nAtmosphere\n0")
        end
      end
    end
  end
end
