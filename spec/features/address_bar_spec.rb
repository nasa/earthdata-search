# EDSC-147 - EDSC-153: Persisting sessions and bookmarks

require 'spec_helper'

describe 'Address bar', reset: false do

  def query_string
    URI.parse(current_url).query
  end

  context 'when searching by keywords' do
    before(:all) do
      visit '/search'
      fill_in "keywords", with: 'C1000000019-LANCEMODIS'
    end

    it 'saves the keyword condition in the address bar' do
      expect(page).to have_query_string('free_text=C1000000019-LANCEMODIS')
    end

    context 'clearing filters' do
      before(:all) { click_link "Clear Filters" }

      it 'removes the temporal condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a temporal condition' do
    before(:all) { visit '/search?free_text=C1000000019-LANCEMODIS' }

    it 'loads the condition into the keywords field' do
      expect(page).to have_field('keywords', with: 'C1000000019-LANCEMODIS')
    end

    it 'filters datasets using the condition' do
      expect(page).to have_content('MOD04_L2')
    end
  end

  context 'when searching by temporal' do
    before(:all) do
      visit '/search'
      click_link "Temporal"
      js_check_recurring "dataset"
      fill_in "Start", with: "12-01 00:00:00"
      close_datetimepicker
      fill_in "End", with: "12-31 00:00:00"
      close_datetimepicker
      script = "edsc.page.query.temporal.pending.years([1970, 1975])"
      page.execute_script(script)
      js_click_apply ".temporal-dropdown"
    end

    it 'saves the temporal condition in the address bar' do
      expect(page).to have_query_string('temporal=1970-12-01T00%3A00%3A00.000Z%2C1975-12-31T00%3A00%3A00.000Z%2C335%2C365')
    end

    context 'clearing filters' do
      before(:all) do
        # Temporal dropdown causes capybara to throw persistent fits of ClickFailed errors, so we do this with JS.
        page.execute_script('$(".clear-filters").click()')
      end

      it 'removes the temporal condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a temporal condition' do
    before(:all) { visit '/search?temporal=1970-12-01T00%3A00%3A00.000Z%2C1975-12-31T00%3A00%3A00.000Z%2C335%2C365' }

    it 'loads the condition into the temporal fields' do
      click_link "Temporal"
      within('.temporal-dropdown') do
        expect(page).to have_checked_field('Recurring?')
        expect(page).to have_field('Start', with: '12-01 00:00:00')
        expect(page).to have_field('End', with: '12-31 00:00:00')
        expect(page).to have_text('Date Range: 1970 - 1975')
      end
    end

    it 'displays the temporal on the map' do
      expect(page.find('#temporal-query')).to have_text('Start 12-01 00:00:00 Stop 12-31 00:00:00 Range 1970 - 1975')
    end

    it 'filters datasets using the condition' do
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("Amazon River Basin Precipitation, 1972-1992")
    end
  end

  context 'when searching by spatial' do
    before(:all) do
      visit '/search'
      create_bounding_box(0, 0, 10, 10)
    end

    it 'saves the spatial condition in the address bar' do
      expect(page).to have_query_string('bounding_box=0%2C0%2C10%2C10')
    end

    context 'clearing filters' do
      before(:all) { click_link "Clear Filters" }

      it 'removes the spatial condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a spatial condition' do
    before(:all) { visit '/search?bounding_box=0%2C0%2C10%2C10' }

    it 'draws the condition on the map' do
      expect(page).to have_selector('#map path', count: 1)
    end

    it 'filters datasets using the condition' do
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end
  end

  context 'when searching by facets' do
    before(:all) do
      visit '/search'
      find(".facets-item", text: "EOSDIS").click
    end

    it 'saves the facet condition in the address bar' do
      expect(page).to have_query_string('campaign%5B%5D=EOSDIS')
    end

    context 'clearing filters' do
      before(:all) { click_link "Clear Filters" }

      it 'removes the facet condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a facet condition' do
    before(:all) { visit '/search?campaign%5B%5D=EOSDIS' }

    it 'displays the selected facet condition' do
      within(:css, '.selected-facets-panel') do
        expect(page).to have_content("EOSDIS")
        expect(page).to have_css(".facets-item.selected")
      end
    end

    it 'filters datasets using the condition' do
      expect(page).to have_no_text('2000 Pilot Environmental Sustainability Index (ESI)')
    end
  end
end
