# -*- coding: utf-8 -*-
require 'spec_helper'

describe 'Collection details', reset: false do
  it 'displays the collection details' do
    load_page :search
    fill_in 'keywords', with: 'AST_L1AE'
    expect(page).to have_content('ASTER Expedited L1A')
    first_collection_result.click_link('View collection details')
    wait_for_xhr
    within('#collection-details') do
      expect(page).to have_content('ASTER Expedited L1A Reconstructed Unprocessed Instrument Data V003')
      expect(page).to have_content('Archive Center: LPDAAC')
      expect(page).to have_content('Processing Center: LPDAAC')
      expect(page).to have_content('Short Name: AST_L1AE')
      expect(page).to have_content('VERSION 3')
      expect(page).to have_content('Contacts: LP DAAC User Services 605-594-6116 (phone) 605-594-6963 (fax) lpdaac@usgs.gov')
      expect(page).to have_content('Spatial Coordinates: Bounding Rectangle: (90.0°, -180.0°, -90.0°, 180.0°)')
      expect(page).to have_content('Metadata Formats: Native | ATOM | ECHO10 | ISO19115 | DIF')
      expect(page).to have_content('Temporal Extent: 1999-12-18 ongoing')
      expect(page).to have_content('API Endpoints: CMR OSDD')
      expect(page).to have_content('Science Keywords: Earth ScienceSpectral/EngineeringInfrared Wavelengths Earth ScienceSpectral/EngineeringVisible Wavelengths')
    end
  end

  context "when selecting a collection that is only viewable after logging in" do
    before :all do
      Capybara.reset_sessions!
      load_page :search
      login
      wait_for_xhr
      fill_in 'keywords', with: 'C197265171-LPDAAC_ECS'
      wait_for_xhr
    end

    after :all do
      Capybara.reset_sessions!
    end

    it "displays the collection details" do
      first_collection_result.click_link('View collection details')
      wait_for_xhr
      within('#collection-details') do
        expect(page).to have_content('ASTER Global Digital Elevation Model V002')
        expect(page).to have_content('Archive Center: LPDAAC')
        expect(page).to have_content('Processing Center: JPL')
        expect(page).to have_content('Short Name: ASTGTM')
        expect(page).to have_content('VERSION 002')
        expect(page).to have_content('Contacts: LP DAAC User Services 605-594-6116 (phone) 605-594-6963 (fax) lpdaac@usgs.gov')
        expect(page).to have_content('Spatial Coordinates: Bounding Rectangle: (82.0°, -180.0°, -83.0°, 180.0°)')
        expect(page).to have_content('Metadata Formats: Native | ATOM | ECHO10 | ISO19115 | DIF')
        expect(page).to have_content('Temporal Extent: 1999-12-18 to 2011-02-28')
        expect(page).to have_content('API Endpoints: CMR OSDD')
        expect(page).to have_content('Science Keywords: Earth ScienceLand SurfaceTopography')
      end
    end
  end

  context "when selecting a collection without contacts in the xml" do
    before :all do
      load_page :search, q: 'Aqua_AMSR-E_L3_TB_23.8GHz-H'
      first_collection_result.click_link('View collection details')
    end

    it "displays the collection's detail page with no errors" do
      expect(page).to have_content('Contacts: Download Page')
    end
  end

  context "when selecting a collection with point spatial" do
    before :all do
      load_page :search, q: 'C179003030-ORNL_DAAC'
      expect(page).to have_content('15 Minute Stream Flow Data: USGS (FIFE)')
      first_collection_result.click_link('View collection details')
    end

    it "does not display the collection's spatial bounds on the map" do
      expect(page).to have_no_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

  context "when selecting a collection with bounding box spatial" do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'C179002945-ORNL_DAAC'
      wait_for_xhr
      first_collection_result.click_link('View collection details')
    end

    it "does not display the collection's spatial bounds on the map" do
      expect(page).to have_no_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

  context "when selecting a collection with polygon spatial" do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'C1220111370-NSIDCV0'
      expect(page).to have_content('AVHRR Leads-ARI Polar Gridded Brightness Temperatures')
      first_collection_result.click_link('View collection details')
    end

    it "does not display the collection's spatial bounds on the map" do
      expect(page).to have_no_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

  # FIXME: This collection no longer has line spatial
  #context "when selecting a collection with line spatial" do
  #  before :all do
  #    load_page :search
  #    fill_in 'keywords', with: 'NSIDC-0239'
  #    expect(page).to have_content('SMEX02 Atmospheric Aerosol Optical Properties Data')
  #    first_collection_result.click_link('View collection details')
  #  end
  #
  #  it "displays the collection's spatial bounds on the map" do
  #    expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
  #  end
  #end

  context "when selecting a collection with multiple temporal" do
    before :all do
      load_page '/search/collection-details', env: :uat, focus: 'C1204482909-GCMDTEST'
      expect(page).to have_content('CALIPSO Lidar Level 2 5km aerosol profile data V3-01')
    end

    it 'displays the combined temporal' do
      expect(page).to have_content('2006-06-13 to 2011-10-31')
    end
  end

  context "when selecting a collection with multiple temporal fields but some of which have only BeginningDateTime" do
    before :all do
      load_page '/search/collection-details', env: :uat, focus: 'C1204424196-GCMDTEST'
      expect(page).to have_content('JAXA/EORC Tropical Cyclones database')
    end

    it 'displays the combined temporal' do
      expect(page).to have_content('1997-12-07 ongoing')
    end
  end

  context "when selecting a collection with multiple lines of description" do
    before :all do
      load_page '/search/collection-details', focus: 'C197265171-LPDAAC_ECS'
    end

    it "displays carriage returns in the description" do
      expect(page).to have_content(" (METI).\n\nASTER is capable of collecting in-")
    end
  end

  context "when selecting a collection with multiple spatial values" do
    before :all do
      load_page '/search/collection-details', focus: 'C1214560151-JAXA'
    end

    it "displays all spatial content" do
      expect(page).to have_content("Bounding Rectangle: (22°, -96°, -20°, -48°) Bounding Rectangle: (10°, -14°, -9°, 34°) Bounding Rectangle: (27°, 92°, -20°, 151°)")
    end
  end
end
