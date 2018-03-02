require 'spec_helper'

describe 'Collection Facets Show/Hide', reset: false do
  before :all do
    Capybara.reset_sessions!

    load_page :search, facets: true
  end

  context 'When closing the facet list with no facets selected' do
    before :all do
      page.find('#master-overlay-parent .master-overlay-hide-parent').click
    end

    it 'displays links to re-open the facet list' do
      expect(page).to have_css('a.master-overlay-show-parent')
    end

    context 'When re-opening the facet list' do
      before :all do
        page.find('.master-overlay-when-parent-hidden .master-overlay-show-parent').click
      end

      it 'hides the link to show facets' do
        expect(page).to have_css('a.master-overlay-hide-parent')
      end

      it 'shows the facet panel' do
        expect(page).to have_css('#master-overlay-parent')
      end
    end
  end

  context 'When closing the facet list with one facet selected' do
    before :all do
      find('h3.panel-title', text: 'Projects').click

      within '.panel.projects' do
        first('.facets-item').click
        wait_for_xhr
      end

      page.find('#master-overlay-parent .master-overlay-hide-parent').click
    end

    after :all do
      # Clears any selected facets to accomodate random order of tests
      reset_search

      # Reset the facet category toggling
      reset_facet_ui
    end

    it 'displays links to re-open the facet list' do
      expect(page).to have_css('a.master-overlay-show-parent')
    end

    it 'informs the user that one facet is selected' do
      within '.master-overlay-when-parent-hidden .master-overlay-show-parent' do
        expect(page).to have_content('1 facet applied')
      end
    end

    context 'When re-opening the facet list' do
      before :all do
        page.find('.master-overlay-when-parent-hidden .master-overlay-show-parent').click
      end

      it 'the facets are still selected' do
        within '.panel.projects' do
          expect(page).to have_css('.facets-item.selected', count: 1)
        end
      end
    end
  end

  context 'When closing the facet list with two facets from different categories selected' do
    before :all do
      find('h3.panel-title', text: 'Platforms').click

      within '.panel.platforms' do
        first('.facets-item').click
        wait_for_xhr
      end

      find('h3.panel-title', text: 'Projects').click

      within '.panel.projects' do
        first('.facets-item').click
        wait_for_xhr
      end

      page.find('#master-overlay-parent .master-overlay-hide-parent').click
    end

    after :all do
      # Clears any selected facets to accomodate random order of tests
      reset_search

      # Reset the facet category toggling
      reset_facet_ui
    end

    it 'displays links to re-open the facet list' do
      expect(page).to have_css('a.master-overlay-show-parent')
    end

    it 'informs the user that one facet is selected' do
      within '.master-overlay-when-parent-hidden .master-overlay-show-parent' do
        expect(page).to have_content('2 facets applied')
      end
    end

    context 'When re-opening the facet list' do
      before :all do
        page.find('.master-overlay-when-parent-hidden .master-overlay-show-parent').click
      end

      it 'the facets are still selected' do
        within '.panel.platforms' do
          expect(page).to have_css('.facets-item.selected', count: 1)
        end
        within '.panel.projects' do
          expect(page).to have_css('.facets-item.selected', count: 1)
        end
      end
    end
  end
end
