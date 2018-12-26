require 'rails_helper'

describe 'Collection Facets With Nesting' do
  before :all do
    Capybara.reset_sessions!

    load_page :search, facets: true
  end

  after :all do
    # Clears any selected facets to accomodate random order of tests
    reset_search

    # Reset the facet category toggling
    reset_facet_ui
  end

  context 'When selecting multiple facets with children' do
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
    end

    it 'shows the selected facet siblings' do
      within '.keywords' do
        expect(page).to have_content('Aerosols')
        expect(page).to have_content('Sea Ice')
        expect(page).to have_content('Ocean Optics')
      end
    end

    it 'displays the chosen facets as selected' do
      within '.keywords' do
        expect(page).to have_css('.facets-item.selected', count: 3)
      end
    end

    context 'When selecting a nested facet that also has children' do
      before :all do
        within '.keywords' do
          find('.facets-item', text: 'Sea Ice', match: :prefer_exact).click
          wait_for_xhr
        end
      end

      it 'shows the selected facet siblings' do
        within '.keywords' do
          expect(page).to have_content('Freeboard')
        end
      end

      # TODO: RDA // EDSC-1772: Facets are being deselected when they shouldn't
      # it 'displays the previously chosen as well as the child facet as selected' do
      #   within '.keywords' do
      #     expect(page).to have_css('.facets-item.selected', count: 4)
      #   end
      # end

      context 'When selecting the parent facet' do
        before :all do
          within '.keywords' do
            find('.facets-item', text: 'Cryosphere', match: :prefer_exact).click
            wait_for_xhr
          end
        end

        # TODO: RDA // EDSC-1772: Facets are being deselected when they shouldn't
        # it 'display only the previously chosen facets as selected' do
        #   within '.keywords' do
        #     expect(page).to have_css('.facets-item.selected', count: 2)
        #   end
        # end
      end
    end
  end
end
