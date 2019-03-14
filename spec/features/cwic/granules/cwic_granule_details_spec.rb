require 'rails_helper'

describe 'CWIC-enabled granule results view' do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search, q: 'USGS_EDC_EO1_ALI', ac: true
    view_granule_results('EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data')
    first_granule_list_item.click_link('View granule details')
    wait_for_xhr
  end

  context 'for CWIC granules', pending_updates: true do
    context 'viewing granule details' do
      it 'displays a textual summary of metadata provided in the OpenSearch result' do
        within('#granule-details') do
          expect(page).to have_content("Author:\n  name: CEOS WGISS Integrated Catalog (CWIC) - CWIC Contact - Email: cwic-help@wgiss.ceos.org - Web: http://wgiss.ceos.org/cwic\n  email: cwic-help@wgiss.ceos.org")
        end
      end

      it 'displays a link to download the original OpenSearch granule metadata' do
        click_link 'Metadata'
        within('#granule-details') do
          expect(page).to have_selector('a[href^="https://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1220566654-USGS_LTA"]')
        end
        click_link 'Information'
      end

      context 'and clicking on the metadata link' do
        before :all do
          click_link 'Metadata'
          click_on 'Native'
          wait_for_xhr
        end

        after :all do
          load_page :search, q: 'USGS_EDC_EO1_ALI', ac: true
          view_granule_results('EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data')
          first_granule_list_item.click_link('View granule details')
          wait_for_xhr
        end

        it 'downloads the original OpenSearch metadata in a new window' do
          expect(page).not_to have_link('Back to Granules')
          metadata = CGI.unescapeHTML(page.source)
          expect(metadata.include?('<?xml')).to be_truthy
          expect(metadata.include?('<feed')).to be_truthy
        end
      end
    end

    context 'on `Information` tab' do
      it 'displays only metadata fields for which the granule has data' do
        within('#granule-details') do
          expect(page).not_to have_content('GranuleUR:')
          expect(page).not_to have_content('Collection:')
        end
      end
    end

    context 'on `Metadata` tab' do
      before :all do
        click_link 'Metadata'
      end

      after :all do
        click_link 'Information'
      end

      it 'displays no links to CMR metadata or formats' do
        within('#granule-details') do
          expect(page).not_to have_content('UMM-G')
          expect(page).not_to have_content('ATOM')
          expect(page).not_to have_content('ECHO10')
          expect(page).not_to have_content('ISO 19115')
        end
      end
    end
  end
end
