require 'rails_helper'

describe 'CWIC-enabled data access' do
  extend Helpers::CollectionHelpers

  dataset_id = 'EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data'
  search_params = {
    focus: 'C1220566654-USGS_LTA',
    temporal: ['2016-01-21T00:00:00Z', '2016-01-21T23:59:59Z'],
    ac: true,
    authenticate: 'edsc'
  }

  context 'When configuring data access for a CWIC-tagged collection', data_specific: true do
    before :all do
      Capybara.reset_sessions!
      AccessConfiguration.destroy_all
      load_page :search, search_params
      view_granule_results(dataset_id)
      click_button 'Download'
      wait_for_xhr
    end

    it 'provides the "Download" option' do
      expect(page).to have_field('Download')
    end
  end

  context 'When choosing to download data for a CWIC-tagged collection', edit_options: true do
    before :all do
      Capybara.reset_sessions!
      AccessConfiguration.destroy_all
      load_page :search, search_params
      view_granule_results(dataset_id)
      click_button 'Download'
      wait_for_xhr
      choose 'Direct Download'
      click_on 'Submit'
      wait_for_xhr
    end

    it 'provides a button to view download links' do
      expect(page).to have_link('View Download Links')
    end

    it 'provides a button to download links in a file' do
      expect(page).to have_link('Download Data Links File')
    end

    context 'and clicking the view download links button' do
      before(:all) do
        @cwic_links = window_opened_by do
          click_on('View Download Links')
        end
      end
      it 'presents a list of download links with associated link titles' do
        within_window(@cwic_links) do
          expect(page).to have_no_text('Loading more...')
          expect(page).to have_link('Granule download URL', count: 21)
          expect(page).to have_link('Browse image URL', count: 21)
        end
      end
    end
  end

  context 'choosing to download data for single CWIC-tagged granule', single_granule: true do
    before :all do
      Capybara.reset_sessions!
      AccessConfiguration.destroy_all
      load_page :search, search_params
      view_granule_results(dataset_id)
      within(first_granule_list_item) do
        click_link 'Configure and download single granule data'
      end
      wait_for_xhr
      choose 'Direct Download'
      click_on 'Submit'
      wait_for_xhr
      @cwic_links = window_opened_by do
        click_on('View Download Links')
      end
    end

    it 'provides a list of download links for the single granule' do
      within_window(@cwic_links) do
        expect(page).to have_no_text('Loading more...')
        expect(page).to have_link('Granule download URL', count: 1)
        expect(page).to have_link('Browse image URL', count: 1)
      end
    end
  end
end
