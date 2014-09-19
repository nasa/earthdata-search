require 'spec_helper'

describe 'Dataset API Endpoints', reset: false do
  context 'when viewing the dataset details for a dataset with granules' do
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

  context 'when viewing the dataset details for a dataset with GIBS' do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'C1000000019-LANCEMODIS'
      wait_for_xhr
      click_link "View details"
      wait_for_xhr
      click_link 'API Endpoints'
    end

    it 'provides the path to the GIBS endpoint' do
      expect(page).to have_content("http://map1.vis.earthdata.nasa.gov/wmts-geo/MODIS_Terra_Aerosol/default/{Time}/EPSG4326_2km/{ZoomLevel}/{TileRow}/{TileCol}.png")
    end
  end

  context 'when viewing the dataset details for a dataset with OPeNDAP' do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'C183451157-GSFCS4PA'
      wait_for_xhr
      click_link "View details"
      wait_for_xhr
      click_link 'API Endpoints'
    end

    it 'provides a link to the OPeNDAP endpoint' do
      expect(page).to have_css('a[href="http://acdisc.gsfc.nasa.gov/opendap/Aqua_AIRS_Level3/AIRX3C28.005/"]')
    end
  end

  context 'when viewing the dataset details for a dataset without granules, GIBS, or OPeNDAP' do
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

    it 'does not provide a link to the GIBS endpoint' do
      expect(page).to have_no_content 'GIBS'
    end

    it 'does not provide a link to the OPeNDAP endpoint' do
      expect(page).to have_no_content 'OPeNDAP'
    end
  end
end
