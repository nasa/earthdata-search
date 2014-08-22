require "spec_helper"

describe "Data download page", reset: false do
  downloadable_dataset_id = 'C179003030-ORNL_DAAC'
  downloadable_dataset_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  non_downloadable_dataset_id = 'C179001887-SEDAC'
  non_downloadable_dataset_title = '2000 Pilot Environmental Sustainability Index (ESI)'

  orderable_dataset_id = 'C179003030-ORNL_DAAC'
  orderable_dataset_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  non_orderable_dataset_id = 'C179001887-SEDAC'
  non_orderable_dataset_title = '2000 Pilot Environmental Sustainability Index (ESI)'

  before(:all) do
    load_page :search, overlay: false
    login
  end

  after(:all) do
    wait_for_xhr
    AccessConfiguration.destroy_all if page.server.responsive?
  end

  context "when datasets have been selected for direct download" do
    before :all do
      load_page 'data/configure', project: [downloadable_dataset_id, non_downloadable_dataset_id]
      wait_for_xhr

      # Download the first
      choose 'Download'
      click_on 'Continue'
      # Confirm address
      click_on 'Submit'
    end

    it "displays information on using direct download" do
      expect(page).to have_content('The following datasets are available for immediate download')
      expect(page).to have_content(downloadable_dataset_title)
    end

    it "displays a link to access a page containing direct download urls for datasets chosen for direct download" do
      expect(page).to have_link('View Download Links')
    end

    it "displays a link to access a page containing direct download urls for datasets chosen for direct download" do
      expect(page).to have_link('Download Access Script')
    end

    it "displays links for direct downloads for dataset only datasets" do
      expect(page).to have_content(non_downloadable_dataset_title)
      expect(page).to have_content('Data download page')
    end

    context "upon clicking on a direct download link" do
      before :all do
        click_link "View Download Link"
      end

      it "displays a page containing direct download hyperlinks for the dataset's granules in a new window" do
        within_window('Earthdata Search - Downloads') do
          expect(page).to have_link("http://daac.ornl.gov/data/fife/data/hydrolgy/strm_15m/y1984/43601715.s15")
        end
      end
    end

    context "upon clicking on a direct download link" do
      before :all do
        click_link "Download Access Script"
      end

      it "downloads a shell script which performs the user's query" do
        within_window(page.driver.browser.get_window_handles.last) do
          expect(page).to have_content('#!/bin/sh')
          expect(page).to have_content('http://daac.ornl.gov/data/fife/data/hydrolgy/strm_15m/y1988/80611715.s15')
        end
      end
    end
  end

  context "when no datasets have been selected for direct download" do
    before :all do
      load_page 'data/configure', project: [orderable_dataset_id]
      wait_for_xhr

      choose 'Ftp_Pull'
      select 'FTP Pull', from: 'Offered Media Delivery Types'
      select 'Tape Archive Format (TAR)', from: 'Offered Media Format for FTPPULL'
      click_on 'Continue'

      # Confirm address
      click_on 'Submit'
    end

    it "displays no information on direct downloads" do
      expect(page).to have_no_content('The following datasets are available for immediate download')
    end
  end

  context "when datasets have been selected for asynchronous access" do
    before :all do
      load_page 'data/configure', project: [orderable_dataset_id, non_orderable_dataset_id]
      wait_for_xhr

      choose 'Ftp_Pull'
      select 'FTP Pull', from: 'Offered Media Delivery Types'
      select 'Tape Archive Format (TAR)', from: 'Offered Media Format for FTPPULL'
      click_on 'Continue'

      # No actions available on the second, continue
      click_on 'Continue'
      # Confirm address
      click_on 'Submit'
    end

    it "displays information on obtaining data asynchronously" do
      expect(page).to have_content('The following datasets are being processed')
      expect(page).to have_content(orderable_dataset_title)
    end

    it "indicates current order status" do
      expect(page).to have_text('Not Validated')
    end

    it "provides a link to cancel the order" do
      expect(page).to have_link("Cancel")
    end

    it "displays no tracking links for datasets that were not chosen for asychronous access" do
      within '.data-access-orders' do
        expect(page).to have_no_content(non_orderable_dataset_title)
      end
    end
  end

  context "when no datasets have been selected for asynchronous access" do
    before :all do
      load_page 'data/configure', project: [downloadable_dataset_id]
      wait_for_xhr

      choose 'Download'
      click_on 'Submit'
    end

    it "displays no information on direct downloads" do
      expect(page).to have_no_content('The following datasets are being processed')
    end
  end
end
