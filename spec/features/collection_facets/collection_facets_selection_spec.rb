require 'spec_helper'

describe 'Collection Facet Selection', pending_updates: true do
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

  # EDSC-622 - We had been displaying duplicate entries with special characters escaped
  context 'When applying facets containing special characters' do
    before :each do
      fill_in :keywords, with: 'C203234448-LAADS'
      wait_for_xhr

      find('h3.panel-title', text: 'Keywords').click
      find('.facet-title', text: 'Spectral/Engineering').click
      wait_for_xhr
    end

    it 'does not display a duplicate entry with special characters escaped' do
      expect(page).to have_no_content('Spectral%2FEngineering')
    end

    it 'displays the selected entry' do
      expect(page).to have_content('Spectral/Engineering')
    end
  end

  context 'When selecting multiple facets from the same category' do
    before :all do
      find('h3.panel-title', text: 'Organizations').click

      within('.organizations') do
        @first_organization = find('.facets-item .facet-title', match: :first)
        @first_organization_title = @first_organization.text
        @first_organization_collection_count = find('.facets-item .facet-item-collection-count', match: :first).text

        @first_organization.click

        wait_for_xhr

        @second_organization = find('.facets-item:nth-of-type(2) .facet-title').click
        wait_for_xhr
      end
    end

    it 'ORs the results of the same category' do
      expect(collection_results_header_value.text.to_i).to be >= @first_organization_collection_count.to_i
    end
  end

  context 'When selecting multiple facets from different categories' do
    before :all do
      find('h3.panel-title', text: 'Organizations').click

      within('.organizations') do
        @first_organization = find('.facets-item', match: :first)
        @first_organization_title = find('.facets-item .facet-title', match: :first).text
        @first_organization_collection_count = find('.facets-item .facet-item-collection-count', match: :first).text
      end
      @first_organization.click

      wait_for_xhr

      find('h3.panel-title', text: 'Platforms').click
      within('.platforms') do
        @first_platform = find('.facets-item .facet-title', match: :first)
        @first_platform_title = @first_platform.text
        @first_platform_collection_count = find('.facets-item .facet-item-collection-count', match: :first).text
      end
      @first_platform.click

      wait_for_xhr
    end

    it 'ANDs the results of different categories' do
      expect(page).to have_content("#{@first_platform_collection_count} Matching Collections")
    end
  end
end
