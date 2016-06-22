require "spec_helper"

describe "CWIC-enabled data access", reset: false do

  extend Helpers::CollectionHelpers

  dataset_id = "EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data"
  search_params = {
    q: 'USGS_EDC_EO1_ALI',
    temporal: ['2016-01-21T00:00:00Z', '2016-01-21T23:59:59Z']
  }

  after(:all) do
    wait_for_xhr
    AccessConfiguration.destroy_all if page.server.responsive?
  end

  context "configuring data access for a CWIC-tagged collection" do
    before :all do
      AccessConfiguration.destroy_all
      load_page :search, search_params
      login
      view_granule_results(dataset_id)
      click_link 'Retrieve Collection Data'
      wait_for_xhr
    end

    it 'provides the "Download" option', acceptance: true do
      expect(page).to have_field("Download")
    end
  end

  context "choosing to download data for a CWIC-tagged collection" do
    before :all do
      AccessConfiguration.destroy_all
      load_page :search, search_params
      login
      view_granule_results(dataset_id)
      click_link 'Retrieve Collection Data'
      wait_for_xhr
      choose 'Download'
      click_on 'Submit'
      wait_for_xhr
    end

    it "provides a button to view download links", acceptance: true do
      expect(page).to have_link('View Download Links')
    end


    context "and clicking the view download links button" do
      before(:all) do
        click_on('View Download Links')
      end
      it 'presents a list of download links with associated link titles', acceptance: true do
        within_last_window do
          expect(page).to have_no_text('Loading more...')
          expect(page).to have_link('Granule download URL', count: 37)
          expect(page).to have_link('Browse image URL', count: 37)
        end
      end
    end
  end

  context "choosing to download data for single CWIC-tagged granule" do
    before :all do
      AccessConfiguration.destroy_all
      load_page :search, search_params
      login
      view_granule_results(dataset_id)
      within(first_granule_list_item) do
        click_link 'Retrieve single granule data'
      end
      wait_for_xhr
      choose 'Download'
      click_on 'Submit'
      wait_for_xhr
      click_on('View Download Links')
    end

    it 'provides a list of download links for the single granule' do
      within_last_window do
        expect(page).to have_no_text('Loading more...')
        expect(page).to have_link('Granule download URL', count: 1)
        expect(page).to have_link('Browse image URL', count: 1)
      end
    end
  end

end
