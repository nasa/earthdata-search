require 'spec_helper'

describe 'Dataset API Endpoints', reset: false do
  context 'A dataset with granules' do
    before :all do
      load_page :search
      click_link "Temporal"
      fill_in "Start", with: "1985-12-01 00:00:00"
      close_datetimepicker
      js_click_apply ".temporal-dropdown"

      fill_in 'keywords', with: 'C179003030-ORNL_DAAC'
      wait_for_xhr
      click_link "View details"
      wait_for_xhr
      click_link 'API Endpoints'
    end

    it 'provides a link to the ECHO API for the datasets granules' do
      expect(page).to have_css('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/granules?temporal=1985-12-01T00%3A00%3A00.000Z%2C&echo_collection_id=C179003030-ORNL_DAAC&sort_key%5B%5D=-start_date&page_size=20"]')
    end
  end

  context 'A dataset without granules' do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'C179001887-SEDAC'
      wait_for_xhr
      click_link "View details"
      wait_for_xhr
      click_link 'API Endpoints'
    end

    it 'does not provide a link to the ECHO API for granules' do
      expect(page).to have_no_content 'ECHO Granules'
    end
  end
end
