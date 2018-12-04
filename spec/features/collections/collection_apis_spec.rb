require 'spec_helper'

describe 'Collection API Endpoints', reset: false do
  context 'when viewing the collection details for a collection with granules' do
    before :all do
      load_page '/search', env: :sit

      click_link 'Temporal'
      fill_in 'Start', with: "1985-12-01 00:00:00\t\t"
      js_click_apply '.temporal-dropdown'
      wait_for_xhr

      fill_in 'keywords', with: 'C1000000257-DEV07'
      wait_for_xhr
      click_link 'View collection details'
      wait_for_xhr
      click_on 'For developers'
    end

    it 'provides a link to the CMR API for the collections granules' do
      expect(collection_details).to have_css('a[href="https://cmr.sit.earthdata.nasa.gov/search/granules.json?temporal=1985-12-01T00%3A00%3A00.000Z%2C&echo_collection_id=C1000000257-DEV07&sort_key%5B%5D=-start_date&page_size=20"]')
    end
  end

  context 'when viewing the collection details for a collection with GIBS' do
    before :all do
      load_page :search, env: :sit
      fill_in 'keywords', with: 'C24936-LAADS'
      wait_for_xhr
      click_link 'View collection details'
      wait_for_xhr
      click_on 'For developers'
    end

    it 'provides the path to the GIBS endpoint' do
      expect(collection_details).to have_css('a[href="http://map1.vis.earthdata.nasa.gov/wmts-geo/MODIS_Terra_Aerosol/default/{Time}/EPSG4326_2km/{ZoomLevel}/{TileRow}/{TileCol}.png"]')
    end

    it 'provides the GIBS layers that are available to view' do
      expect(collection_details).to have_content('GIBS Imagery Projection Availability')
      expect(collection_details).to have_content('Geographic')
    end
  end

  context 'when viewing the collection details for a collection with OPeNDAP' do
    before :all do
      load_page '/search/collection-details', focus: 'C1214305813-AU_AADC', ac: true
      click_on 'View All Related URLs'
    end

    it 'provides a link to the OPeNDAP endpoint' do
      within '#related-urls-modal' do
        expect(page).to have_css('a[href="http://data.aad.gov.au/aadc/portal/download_file.cfm?file_id=1677"]')
      end
    end
  end

  context 'when viewing the collection details for a collection with MODAPS WCS' do
    before :all do
      load_page :search, ac: true
      fill_in 'keywords', with: 'C1219032686-LANCEMODIS'
      wait_for_xhr
      click_link 'View collection details'
      wait_for_xhr
      click_on 'For developers'
    end

    it 'provides the path to the MODAPS WCS endpoint' do
      expect(collection_details).to have_css('a[href="http://modwebsrv.modaps.eosdis.nasa.gov/wcs/5/MYD04_L2/getCapabilities?service=WCS&version=1.0.0&request=GetCapabilities"]')
    end
  end

  context 'when viewing the collection details for a collection without granules, GIBS, or OPeNDAP' do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'C179001887-SEDAC'
      wait_for_xhr
      click_link 'View collection details'
      wait_for_xhr
    end

    it 'does not provide a link to the CMR API for granules' do
      expect(collection_details).to have_no_content 'CMR'
    end

    it 'does not provide a link to the GIBS endpoint' do
      expect(collection_details).to have_no_link 'GIBS'
    end

    it 'does not provide a link to the OPeNDAP endpoint' do
      expect(collection_details).to have_no_content 'OPeNDAP'
    end

    it 'does not provide a link to the MODAPS WCS endpoint' do
      expect(collection_details).to have_no_content 'MODAPS WCS'
    end
  end
end
