# EDSC-147 - EDSC-153: Persisting sessions and bookmarks

require 'spec_helper'

describe 'Address bar', reset: false do

  def query_string
    URI.parse(current_url).query
  end

  context 'when searching by keywords' do
    before(:all) do
      visit '/search/map'
      fill_in "keywords", with: 'C1000000019-LANCEMODIS'
    end

    it 'saves the keyword condition in the address bar' do
      expect(page).to have_query_string('free_text=C1000000019-LANCEMODIS')
    end

    context 'clearing filters' do
      before(:all) { click_link "Clear Filters" }

      it 'removes the keyword condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a temporal condition' do
    before(:all) { visit '/search/datasets?free_text=C1000000019-LANCEMODIS' }

    it 'loads the condition into the keywords field' do
      expect(page).to have_field('keywords', with: 'C1000000019-LANCEMODIS')
    end

    it 'filters datasets using the condition' do
      expect(page).to have_content('MOD04_L2')
    end
  end

  context 'when searching by temporal' do
    before(:all) do
      visit '/search/map'
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
    before(:all) { visit '/search/datasets?temporal=1970-12-01T00%3A00%3A00.000Z%2C1975-12-31T00%3A00%3A00.000Z%2C335%2C365' }

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
      visit '/search/map'
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
    before(:all) { visit '/search/datasets?bounding_box=0%2C0%2C10%2C10' }

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
      expect(page).to have_query_string('campaign[]=EOSDIS')
    end

    context 'clearing filters' do
      before(:all) { click_link "Clear Filters" }

      it 'removes the facet condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a facet condition' do
    before(:all) { visit '/search?campaign[]=EOSDIS' }

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

  context 'when adding datasets to a project' do
    before(:all) do
      visit '/search/datasets'
      add_dataset_to_project('C179001887-SEDAC', '2000 Pilot Environmental Sustainability Index (ESI)')
      add_dataset_to_project('C179002914-ORNL_DAAC', '30 Minute Rainfall Data (FIFE)')
      click_link "Clear Filters"
    end

    it 'saves the project in the address bar' do
      expect(page).to have_query_string('p=!C179001887-SEDAC!C179002914-ORNL_DAAC')
    end
  end

  context 'when loading a url containing project datasets' do
    before(:all) { visit '/search/project?p=!C179001887-SEDAC!C179002914-ORNL_DAAC' }

    it 'restores the project' do
      expect(page).to have_visible_project_overview
      expect(project_overview).to have_text('2000 Pilot Environmental Sustainability Index (ESI)')
      expect(project_overview).to have_text('30 Minute Rainfall Data (FIFE)')
    end
  end

  context "when viewing a dataset's granules" do
    before(:all) do
      visit '/search/datasets'
      view_granule_results
    end

    it 'saves the selected dataset in the address bar' do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC')
    end
  end

  context "when loading a url containing a dataset's granules" do
    before(:all) { visit '/search/granules?p=C179003030-ORNL_DAAC' }

    it 'restores the dataset granules view' do
      expect(page).to have_visible_granule_list
      expect(granule_list).to have_text('15 Minute Stream Flow')
    end
  end

  context "when viewing a dataset's details" do
    before(:all) do
      visit '/search/datasets'
      first_dataset_result.click_link('View details')
    end

    it 'saves the selected dataset in the address bar' do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC')
    end
  end

  context "when loading a url containing a dataset's details" do
    before(:all) { visit '/search/details?p=C179003030-ORNL_DAAC' }

    it 'restores the dataset details view' do
      expect(page).to have_visible_dataset_details
      expect(dataset_details).to have_text('15 Minute Stream Flow')
    end
  end

  context "setting granule query conditions within the project" do
    before(:all) do
      visit '/search/project?p=!C179003030-ORNL_DAAC!C179002914-ORNL_DAAC'
      first_project_dataset.click_link "Show granule filters"
      check "Find only granules that have browse images."
      second_project_dataset.click_link "Show granule filters"
      select 'Day only', from: "day-night-select"
      second_project_dataset.click_link "Hide granule filters"
      first_project_dataset.click_link "View details"
      wait_for_xhr
      expect(page).to have_visible_dataset_details
    end

    it "saves the query conditions in the URL" do
      expect(page).to have_path('/search/project/details')
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC!C179003030-ORNL_DAAC!C179002914-ORNL_DAAC&p1[browse_only]=true&p2[day_night_flag]=DAY')
    end

    it "does not duplicate the query conditions for the focused dataset" do
      expect(page.current_url).not_to include('p0[browse_only]')
    end
  end

  context "setting granule query conditions when the focused dataset is not the project" do
    before(:all) do
      visit '/search/granules?p=C179003030-ORNL_DAAC!C179002914-ORNL_DAAC'
      click_link "Filter granules"
      check "Find only granules that have browse images."
      wait_for_xhr
    end

    it "saves the query conditions in the URL" do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC!C179002914-ORNL_DAAC&p0[browse_only]=true')
    end

    it "includes query conditions for the focused dataset" do
      expect(page.current_url).to include('p0[browse_only]')
    end
  end

  context "loading a URL with saved query conditions" do
    before :all do
      visit '/search/project?p=C179003030-ORNL_DAAC!C179003030-ORNL_DAAC!C179002914-ORNL_DAAC&p1[browse_only]=true&p2[day_night_flag]=DAY'
    end

    it "restores the granule query conditions" do
      first_project_dataset.click_link "Show granule filters"
      expect(page).to have_checked_field 'Find only granules that have browse images.'
      second_project_dataset.click_link "Show granule filters"
      expect(page).to have_select 'day-night-select', selected: 'Day only'
    end
  end
end
