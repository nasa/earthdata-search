require "spec_helper"

describe "Data download page", reset: false do
  downloadable_collection_id = 'C90762182-LAADS'
  downloadable_collection_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'

  non_downloadable_collection_id = 'C179001887-SEDAC'
  non_downloadable_collection_title = '2000 Pilot Environmental Sustainability Index (ESI)'

  orderable_collection_id = 'C90762182-LAADS'
  orderable_collection_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'

  orderable_collection_id_with_no_browseable_granules = 'C179003216-ORNL_DAAC'

  no_direct_download_collection_id = 'C179003030-ORNL_DAAC'

  non_orderable_collection_id = 'C179001887-SEDAC'
  non_orderable_collection_title = '2000 Pilot Environmental Sustainability Index (ESI)'

  no_resource_collection_id = 'C1214614479-SCIOPS'
  no_resource_collection_title = 'Aeolian Processes in the Dry Valleys'

  no_granules_collection_id = 'C179002107-SEDAC'
  no_granules_collection_title = 'Anthropogenic Biomes of the World, Version 1'

  browseable_collection_id = 'C115003857-NSIDC_ECS'
  browseable_collection_title = 'MODIS/Aqua Sea Ice Extent Daily L3 Global 1km EASE-Grid Night V005'
  browseable_collection_params = {project: [browseable_collection_id],
                               temporal: ['2015-01-01T00:00:00Z', '2015-01-01T00:00:01Z']}

  

  before(:all) do
    AccessConfiguration.destroy_all
    load_page :search, overlay: false
    login
  end

  after(:all) do
    wait_for_xhr
    AccessConfiguration.destroy_all if page.server.responsive?
  end

  context "when some accessed collections have additional resource or documentation links" do
    before :all do
      load_page 'data/configure', project: [downloadable_collection_id]

      choose 'Download'
      click_on 'Submit'
    end

    it "displays a section for additional resources and documentation", intermittent: 1 do
      expect(page).to have_content("Additional Resources and Documentation")
    end

    it "displays links for collections with additional resources and documentation" do
      expect(page).to have_link("MODIS Level 1B Product Information Page at MCST")
    end

    it "displays titles for collections with additional resources and documentation" do
      within('.data-access-resources') do
        expect(page).to have_content("MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005")
      end
    end
  end

  context "when no accessed collections have additional resource or documentation links" do
    before :all do
      load_page 'data/configure', project: [no_resource_collection_id]

      choose 'Download'
      click_on 'Submit'
    end

    it "displays no section for additional resources and documentation" do
      expect(page).to have_no_content("Additional Resources and Documentation")
    end

    it "displays no information for collections without additional resources and documentation" do
      expect(page).to have_content(no_resource_collection_title)
      expect(page).to have_no_selector('.data-access-resources')
    end
  end

  context "selecting the direct download option for granules with browse imagery" do
    before :all do
      load_page 'data/configure', browseable_collection_params
      wait_for_xhr

      choose 'Direct Download'
      click_on 'Submit'
      wait_for_xhr
    end

    it "displays a link to view browse images" do
      expect(page).to have_link('View Browse Image Links')
    end

    context 'clicking on a "View Browse Image Links" button' do
      before :all do
        click_link "View Browse Image Links"
      end

      it "displays links to browse images" do
        within_last_window do
          expect(page).to have_link('ftp://n5eil01u.ecs.nsidc.org/DP0/BRWS/Browse.001/2015.01.02/BROWSE.MYD29P1N.A2015001.h10v25.005.2015002203748.1.jpg')
        end
      end
    end
  end

  context "selecting the direct download option for granules without browse imagery" do
    before :all do
      load_page 'data/configure', project: [no_direct_download_collection_id]
      wait_for_xhr

      choose 'Direct Download'
      click_on 'Submit'
      wait_for_xhr
    end

    it "does not display a link to view browse images" do
      expect(page).to have_no_link('View Browse Image Links')
    end
  end

  context "selecting the direct download option for collections without granules" do
    before :all do
      load_page 'data/configure', project: [no_granules_collection_id]
      wait_for_xhr

      choose 'Download'
      click_on 'Submit'
      wait_for_xhr
    end

    it "does not display a link to view browse images" do
      expect(page).to have_no_link('View Browse Image Links')
    end
  end

  context "selecting an asynchronous access option for granules with browse imagery" do
    before :all do
      load_page 'data/configure', browseable_collection_params
      wait_for_xhr

      choose 'Stage for Delivery'
      click_on 'Continue'

      # Confirm address
      click_on 'Submit'
      wait_for_xhr
    end

    # The intermittence might be caused by db not cleaned up.
    # Reproduceable locally only if the db is not clean. The spec will pass after a db:drop/setup.
    it "displays a link to view browse images", intermittent: 1 do
      expect(page).to have_link('View Browse Image Links')
    end

    context 'clicking on a "View Browse Image Links" button' do
      before :all do
        click_link "View Browse Image Links"
      end

      it "displays links to browse images" do
        within_last_window do
          expect(page).to have_link('ftp://n5eil01u.ecs.nsidc.org/DP0/BRWS/Browse.001/2015.01.02/BROWSE.MYD29P1N.A2015001.h10v25.005.2015002203748.1.jpg')
        end
      end
    end
  end

  context "selecting an asychronous access option for granules without browse imagery" do
    before :all do
      load_page 'data/configure', project: [orderable_collection_id_with_no_browseable_granules]
      wait_for_xhr

      choose 'Stage for Delivery'
      click_on 'Continue'

      # Confirm address
      click_on 'Submit'
      wait_for_xhr
    end

    it "does not display a link to view browse images" do
      expect(page).to have_no_link('View Browse Image Links')
    end
  end

  context "when a collection with more than 2000 granules has been selected for direct download" do
    before :all do
      load_page 'data/configure', project: 'C1000000561-NSIDC_ECS'
      wait_for_xhr
      choose 'Direct Download'
      click_on 'Submit'
      wait_for_xhr
    end
    context 'upon clicking a "View/Download Data Links" button' do
      before :all do
        click_link "View/Download Data Links"
        wait_for_xhr
      end

      it "displays a page containing direct download hyperlinks for the collection's granules in a new window" do
        within_last_window do
          expect(page).to have_text("Collection granule links have been retrieved")
          expect(page).to have_content("https://", count: 3385)
          expect(page).to have_link("https://n5eil01u.ecs.nsidc.org/DP5/AMSA/AE_SI6.003/2011.08.03/AMSR_E_L3_SeaIce6km_V15_20110803.hdf")
        end
      end

      it "does not display inherited collection-level download links" do
        within_last_window do
          expect(page).to have_no_link("http://daac.ornl.gov/cgi-bin/dsviewer.pl?ds_id=1")
        end
      end
    end
  end
  context "when collections have been selected for direct download" do
    before :all do
      load_page 'data/configure', {project: [downloadable_collection_id], temporal: ['2014-07-10T00:00:00Z', '2014-07-10T03:59:59Z']}
      wait_for_xhr

      choose 'Direct Download'
      click_on 'Submit'
      wait_for_xhr
    end

    it 'does not display a header instructing the user to standby for status' do
      expect(page).to_not have_content("Your request is being processed.  Please standby for status.")
    end

    it "displays a link to return to search results" do
      expect(page).to have_link("Back to Data Access Options")
      expect(page).to have_css("a[href^=\"/data/configure?\"]")
    end

    it "displays information on using direct download" do
      expect(page).to have_content('The following collections are available for immediate download')
      expect(page).to have_content(downloadable_collection_title)
    end

    it "displays a link to access a page containing direct download urls for collections chosen for direct download" do
      expect(page).to have_link('View/Download Data Links')
    end

    it "displays a link to access a page containing direct download urls for collections chosen for direct download" do
      expect(page).to have_link('Download Access Script')
    end

    context 'upon clicking a "Download Access Script" button' do
      before :all do
        click_link "Download Access Script"
      end

      it "displays a page with a shell script on it which performs the user's query" do
        within_last_window do
          expect(page).to have_content('#!/bin/sh')
          expect(page).to have_content('ftp://ladsftp.nascom.nasa.gov/allData/5/MYD02QKM/2014/191/MYD02QKM.A2014191.0330.005.2014191162458.hdf')
        end
      end

      context 'and click "Download Script File" button' do
        before :all do
          within_last_window do
            synchronize do
              expect(page).to have_link('Download Script File')
            end
            click_link 'Download Script File'
          end
        end

        it 'downloads a shell script' do
          within_last_window do
            expect(page.source).to have_content('#!/bin/sh')
            expect(page.source).to have_content('ftp://ladsftp.nascom.nasa.gov/allData/5/MYD02QKM/2014/191/MYD02QKM.A2014191.0330.005.2014191162458.hdf')
          end
        end
      end
    end
  end

  context "when no collections have been selected for direct download" do
    before :all do
      load_page 'data/configure', project: [no_direct_download_collection_id]
      wait_for_xhr

      choose 'Stage for Delivery'
      click_on 'Continue'

      # Confirm address
      click_on 'Submit'
    end

    it "displays no information on direct downloads" do
      expect(page).to have_no_content('The following collections are available for immediate download')
    end
  end

  context "when collections have been selected for asynchronous access" do
    before :all do
      load_page 'data/configure', project: [orderable_collection_id, non_orderable_collection_id], temporal: ['2016-01-21T00:00:00Z', '2016-01-21T00:00:01Z']
      wait_for_xhr

      choose 'Stage for Delivery'
      click_on 'Continue'
      # No actions available on the second, continue
      click_on 'Continue'

      # Confirm address
      click_on 'Submit'
      wait_for_xhr
    end

    it "displays a link to return to search results" do
      expect(page).to have_link("Back to Data Access Options")
    end

    it "displays information on obtaining data asynchronously" do
      expect(page).to have_content('The following collections are being processed')
      expect(page).to have_content(orderable_collection_title)
    end

    it "indicates current order status", pending_fixtures: true do
      expect(page).to have_text('Submitting')
    end

    it "provides a link to cancel the order", pending_fixtures: true do
      expect(page).to have_link("Cancel")
    end

    it "displays no tracking links for collections that were not chosen for asychronous access" do
      within '.data-access-orders' do
        expect(page).to have_no_content(non_orderable_collection_title)
      end
    end
  end

  context "when no collections have been selected for asynchronous access" do
    before :all do
      load_page 'data/configure', project: [downloadable_collection_id]
      wait_for_xhr

      choose 'Direct Download'
      click_on 'Submit'
    end

    it "displays no information on direct downloads" do
      expect(page).to have_no_content('The following collections are being processed')
    end
  end
end
