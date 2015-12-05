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
      fill_in 'keywords', with: 'C189202233-LPDAAC_ECS'
      wait_for_xhr
    end

    after :all do
      Capybara.reset_sessions!
    end

    it "displays the collection details" do
      first_collection_result.click_link('View collection details')
      wait_for_xhr
      within('#collection-details') do
        expect(page).to have_content('ASTER Global Digital Elevation Model V001')
        expect(page).to have_content('Archive Center: LPDAAC')
        expect(page).to have_content('Processing Center: JPL')
        expect(page).to have_content('Short Name: ASTGTM')
        expect(page).to have_content('VERSION 1')
        expect(page).to have_content('Contacts: LP DAAC User Services 605-594-6116 (phone) 605-594-6963 (fax) lpdaac@eos.nasa.gov')
        expect(page).to have_content('Spatial Coordinates: Bounding Rectangle: (90.0°, -180.0°, -90.0°, 180.0°)')
        expect(page).to have_content('Metadata Formats: Native | ATOM | ECHO10 | ISO19115 | DIF')
        expect(page).to have_content('Temporal Extent: 1999-12-18 to 2008-06-30')
        expect(page).to have_content('API Endpoints: CMR OSDD')
        expect(page).to have_content('Science Keywords: Earth ScienceLand SurfaceTopography')
      end
    end
  end

  context "when selecting a collection with point spatial" do
    before :all do
      load_page :search
      expect(page).to have_content('15 Minute Stream Flow Data: USGS (FIFE)')
      first_collection_result.click_link('View collection details')
    end

    it "displays the collection's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end

    context "and returning to the collections list" do
      before :all do
        wait_for_xhr
        click_link "Back to Collections"
      end

      it "removes the collection's spatial bounds from the map" do
        expect(page).to have_no_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
      end
    end
  end

  context "when selecting a collection with bounding box spatial" do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'C179002945-ORNL_DAAC'
      wait_for_xhr
      first_collection_result.click_link('View collection details')
    end

    it "displays the collection's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end

    it "splits the spatial bounds across the antimeridian as necessary" do
      # Draws two paths because it is split
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path', count: 2)
    end
  end

  context "when selecting a collection with polygon spatial" do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'NSIDC-0022'
      expect(page).to have_content('AVHRR Polar 1 Km Level 1B Data Set')
      first_collection_result.click_link('View collection details')
    end

    it "displays the collection's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
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

end
