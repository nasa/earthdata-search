# -*- coding: utf-8 -*-
require 'spec_helper'

describe 'Collection details', reset: false do
  context 'when displaying the collection details' do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'AST_L1AE'
      expect(page).to have_content('ASTER Expedited L1A')
      first_collection_result.click_link('View collection details')
      wait_for_xhr
    end
    it 'those details provide the expected collection data' do
      within('#collection-details') do
        expect(page).to have_content('ASTER Expedited L1A Reconstructed Unprocessed Instrument Data V003')
        expect(page).to have_content('LP DAACARCHIVER')
        expect(page).to have_content('JP/METI/AIST/JSS/GDSPROCESSOR')
        expect(page).to have_content('AST_L1AE')
        expect(page).to have_content('VERSION 003')
        expect(page).to have_content('Telephone: 605-594-6116 Fax: 605-594-6963 Email: lpdaac@usgs.gov')
        expect(page).to have_content('Bounding Rectangle: (90.0°, -180.0°, -90.0°, 180.0°)')
        expect(page).to have_content('Temporal Extent: 1999-12-18 ongoing')
        expect(page).to have_content('Science Keywords: EARTH SCIENCESPECTRAL/ENGINEERINGINFRARED WAVELENGTHS EARTH SCIENCESPECTRAL/ENGINEERINGVISIBLE WAVELENGTHS')
      end
    end

    context 'and when the metadata formats toggle is clicked' do
      before :all do
        click_link 'View More Metadata'
      end
      it 'provides the metadata formats links' do
        expect(page).to have_link('Web View')
        expect(page).to have_link('Native')
        expect(page).to have_link('ATOM')
        expect(page).to have_link('ECHO10')
        expect(page).to have_link('ISO19115')
        expect(page).to have_link('DIF')
      end
    end

    context 'and when the API Endpoints toggle is clicked' do
      before :all do
        click_link 'API Endpoints'
        wait_for_xhr
      end
      it 'provides the API Endpoints links' do
        expect(page).to have_link('CMR')
        expect(page).to have_link('OSDD')
      end
    end
  end

  context 'when selecting a collection that is only viewable after logging in' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :uat
      login
      wait_for_xhr
      fill_in 'keywords', with: 'C1216393716-EDF_OPS'
      wait_for_xhr
      first_collection_result.click_link('View collection details')
      wait_for_xhr
    end

    after :all do
      Capybara.reset_sessions!
    end

    it 'displays the collection details' do
      within('#collection-details') do
        expect(page).to have_content('SMAP Enhanced L3 Radiometer Global Daily 9 km EASE-Grid Soil Moisture V001')
        expect(page).to have_content('Name Not ProvidedARCHIVER')
        expect(page).to have_content('SPL3SMP_E')
        expect(page).to have_content('VERSION 001')
        expect(page).to have_content('Bounding Rectangle: (85.0445°, -180.0°, -85.0445°, 180.0°)')
        expect(page).to have_content('Temporal Extent: 2015-03-31 to 2020-12-31')
        expect(page).to have_content('Science Keywords: EARTH SCIENCELAND SURFACESOILS')
      end
    end

    context 'and when the metadata formats toggle is clicked' do
      before :all do
        click_link 'View More Metadata'
      end
      it 'provides the metadata formats links' do
        expect(page).to have_link('Web View')
        expect(page).to have_link('Native')
        expect(page).to have_link('ATOM')
        expect(page).to have_link('ECHO10')
        expect(page).to have_link('ISO19115')
        expect(page).to have_link('DIF')
      end
    end

    context 'and when the API Endpoints toggle is clicked' do
      before :all do
        click_link 'API Endpoints'
      end
      it 'provides the API Endpoints links' do
        expect(page).to have_link('CMR')
        expect(page).to have_link('OSDD')
      end
    end


  end

  context 'when selecting a collection without contacts in the xml' do
    before :all do
      load_page :search, q: 'Aqua_AMSR-E_L3_TB_23.8GHz-H', ac: true
      first_collection_result.click_link('View collection details')
    end

    it "displays the collection's detail page with no errors" do
      expect(page).to have_content('JP/JAXA/SAOCARCHIVER')
    end
  end

  context 'when selecting a collection with point spatial' do
    before :all do
      load_page :search, q: 'C179003030-ORNL_DAAC'
      expect(page).to have_content('15 Minute Stream Flow Data: USGS (FIFE)')
      first_collection_result.click_link('View collection details')
    end

    it "does not display the collection's spatial bounds on the map" do
      expect(page).to have_no_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

  context 'when selecting a collection with bounding box spatial' do
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

  context 'when selecting a collection with polygon spatial' do
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
  # context 'when selecting a collection with line spatial' do
  #   before :all do
  #     load_page :search
  #     fill_in 'keywords', with: 'NSIDC-0239'
  #     expect(page).to have_content('SMEX02 Atmospheric Aerosol Optical Properties Data')
  #     first_collection_result.click_link('View collection details')
  #   end
  #
  #   it "displays the collection's spatial bounds on the map" do
  #     expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
  #   end
  # end

  context 'when selecting a collection with multiple temporal' do
    before :all do
      load_page '/search/collection-details', env: :uat, focus: 'C1204482909-GCMDTEST'
      expect(page).to have_content('CALIPSO Lidar Level 2 5km aerosol profile data V3-01')
    end

    it 'displays all the temporal' do
      expect(page).to have_content('2006-06-13 to 2009-02-16')
      expect(page).to have_content('2009-03-17 to 2011-10-31')
    end
  end

  context 'when selecting a collection with multiple temporal fields but some of which have only BeginningDateTime' do
    before :all do
      load_page '/search/collection-details', env: :uat, focus: 'C1204424196-GCMDTEST'
      expect(page).to have_content('JAXA/EORC Tropical Cyclones database')
    end

    it 'displays all the temporal' do
      expect(page).to have_content('1997-12-07 to 2001-08-06')
      expect(page).to have_content('2001-08-25 ongoing')
    end
  end

  context 'when selecting a collection with multiple lines of description' do
    before :all do
      load_page '/search/collection-details', focus: 'C197265171-LPDAAC_ECS'
    end

    it 'displays carriage returns in the description' do
      expect(page).to have_content(" (METI).\n\nASTER is capable of collecting in-")
    end
  end

  context 'when selecting a collection with multiple spatial values' do
    before :all do
      load_page '/search/collection-details', focus: 'C1214560151-JAXA'
    end

    it 'displays all spatial content' do
      expect(page).to have_content('Bounding Rectangle: (22.0°, -96.0°, -20.0°, -48.0°) Bounding Rectangle: (10.0°, -14.0°, -9.0°, 34.0°) Bounding Rectangle: (27.0°, 92.0°, -20.0°, 151.0°)')
    end
  end

  context 'when selecting a collection with multiple data centers' do
    before :all do
      load_page '/search/collection-details', focus: 'C179460405-LPDAAC_ECS'
    end

    it 'displays all data center content' do
      expect(page).to have_content('JP/METI/AIST/JSS/GDSPROCESSOR LP DAACARCHIVER')
    end
  end

  context "when selecting a collection with temporal that doesn't have an end date or 'ends at present' flag" do
    before :all do
      load_page '/search/collection-details', focus: 'C203234517-LAADS'
    end

    it 'displays the temporal correctly' do
      expect(page).to have_content('1999-12-18 ongoing')
    end
  end

  context 'when selecting a collection with related urls' do
    before do
      load_page '/search/collection-details', focus: 'C1200230663-MMT_1', env: :sit, ac: true
    end

    it 'displays highlighted urls' do
      expect(collection_details).to have_content "Data Set Landing Page"
      expect(collection_details).to have_content "ATBD"
    end

    context 'when clicking View All Related URLs' do
      before do
        # This 'execute' is causing this test to fail on Travis - and it still passes locally
        # with it removed.  So - suppressing for now!
        # page.execute_script "$('#collection-details .master-overlay-content')[0].scrollTop = 400"
        click_on 'View All Related URLs'
      end

      it 'displays all related urls grouped by URLContentType' do
        within '#related-urls-modal' do
          expect(page).to have_content 'Collection URL'
          expect(page).not_to have_content 'Collection URLs'
          expect(page).to have_content 'Publication URLs'
        end
      end

      it 'displays types and subtypes of related urls' do
        within '#related-urls-modal' do
          expect(page).to have_content 'GET DATALANCE'
        end
      end

      it 'displays urls in alphabetical order' do
        within '#related-urls-modal' do
          expect(page).to have_content 'VIEW RELATED INFORMATION http://www.usersguide.come VIEW RELATED INFORMATIONALGORITHM THEORETICAL BASIS DOCUMENT https://www.example.com VIEW RELATED INFORMATIONGENERAL DOCUMENTATION www.lpdaac.org'
        end
      end

      it "doesn't display EDSC or Reverb URLs" do
        within '#related-urls-modal' do
          expect(page).not_to have_content 'GET DATAEARTHDATA SEARCH'
          expect(page).not_to have_content 'GET DATAREVERB'
        end
      end
    end
  end

  context 'when selecting a collection with polygon spatial' do
    before :all do
      load_page '/search/collection-details', focus: 'C1267337984-ASF'
    end

    it 'displays the spatial' do
      expect(page).to have_content('Polygon: ((89.99°, -179.999999°), (65.0°, -179.999999°), (65.0°, -90.0°), (65.0°, 0.0°), (65.0°, 90.0°), (65.0°, 179.999999°), (89.99°, 179.999999°), (89.99°, 90.0°), (89.99°, 0.0°), (89.99°, -90.0°), (89.99°, -179.999999°))')
    end
  end

  context 'when selecting a collection with invalid DOI field' do
    before :all do
      load_page '/search/collection-details', focus: 'C1200235634-EDF_DEV06', env: :sit, ac: true
    end

    it 'displays the DOI and the Authority' do
      expect(page).to have_content('DOI')
      expect(page).to have_content('THE DIGITIAL OBJECT IDENTIFIER.')
      expect(page).not_to have_link('THE DIGITIAL OBJECT IDENTIFIER.')
    end
  end

  context 'when selecting a collection with valid DOI field' do
    before :all do
      load_page '/search/collection-details', focus: 'C179003620-ORNL_DAAC'
    end

    it 'displays the DOI and the Authority' do
      expect(page).to have_content('DOI')
      expect(page).to have_content('10.3334/ORNLDAAC/830')
      expect(page).to have_link('10.3334/ORNLDAAC/830')
    end
  end
end
