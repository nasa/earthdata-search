require "spec_helper"

describe "CWIC-enabled granule results view", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search, env: :uat, ff: "Int'l / Interagency", q: 'USGS_EDC_EO1_ALI'
    view_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")
    first_granule_list_item.click_link('View granule details')
    wait_for_xhr
  end

  context "for CWIC granules" do
    context "viewing granule details" do
      it "displays a textual summary of metadata provided in the OpenSearch result", acceptance: true do
        within('#granule-details') do
          expect(page).to have_content('Title: CWIC OpenSearch Response Updated: 2016-03-21T13:10:46Z Author: name: CEOS WGISS Integrated Catalog (CWIC) - CWIC Contact - Email: cwic-help@wgiss.ceos.org - Web: http://wgiss.ceos.org/cwic email: cwic-help@wgiss.ceos.org Id: http://cwic.wgiss.ceos.org/opensearch/granules.atom/?uid=USGS_EDC_EO1_ALI:EO1A1190382016059110PF_AK3_01 Identifier: http://cwic.wgiss.ceos.org/opensearch/granules.atom/?uid=USGS_EDC_EO1_ALI:EO1A1190382016059110PF_AK3_01 TotalResults: 1 StartIndex: 1 ItemsPerPage: 1 Link: rel: self type: application/atom+xml href: http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=USGS_EDC_EO1_ALI:EO1A1190382016059110PF_AK3_01 title: This Request rel: search type: application/opensearchdescription+xml href: http://cwic.wgiss.ceos.org/opensearch/datasets/USGS_EDC_EO1_ALI/osdd.xml title: Search this resource rel: first type: application/atom+xml href: http://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=USGS_EDC_EO1_ALI&count=null&startIndex=1 title: First result rel: last type: application/atom+xml href: http://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=USGS_EDC_EO1_ALI&count=null&startIndex=1 title: Last result Query: role: request datasetId: USGS_EDC_EO1_ALI uid: USGS_EDC_EO1_ALI:EO1A1190382016059110PF_AK3_01 Entry: title: Entity ID: EO1A1190382016059110PF_AK3_01, Acquisition Date: 28-FEB-16, Target Path: 119, Target Row: 38 id: http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=USGS_EDC_EO1_ALI:EO1A1190382016059110PF_AK3_01 identifier: http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=USGS_EDC_EO1_ALI:EO1A1190382016059110PF_AK3_01 updated: 2016-03-01T21:04:19Z author: name: EROS DATA CENTER - TECHNICAL CONTACT - Customer Services; U.S. Geological Survey; EROS Data Center; 47914 252nd Street; Sioux Falls, SD 57198-0001; USA - Email: custserv@usgs.gov - Phone: 605-594-6151 - FAX: 605-594-6589 email: custserv@usgs.gov box: 30.959824 120.524623 31.809367 121.097114 polygon: 31.067289 120.524623 31.809367 120.726924 31.701382 121.097114 30.959824 120.89203 31.067289 120.524623 date: 2016-02-28T00:45:33Z/2016-02-28T00:45:45Z link: title: Original source metadata rel: via type: text/xml href: http://earthexplorer.usgs.gov/metadata/xml/1852/EO1A1190382016059110PF_AK3_01/ title: Alternate metadata URL rel: alternate type: text/xml href: http://earthexplorer.usgs.gov/metadata/xml/1852/EO1A1190382016059110PF_AK3_01/ title: Browse image URL rel: icon type: image/jpeg href: http://earthexplorer.usgs.gov/browse/eo-1/ali/119/38/2016/EO11190382016059110PF_AK3_01.jpeg title: Granule ordering URL rel: alternate type: text/html href: http://earthexplorer.usgs.gov/order/process?dataset_name=EO1_ALI_PUB&ordered=EO1A1190382016059110PF_AK3_01&node=INVSVC title: Granule download URL rel: enclosure type: text/html href: http://earthexplorer.usgs.gov/download/external/options/EO1_ALI_PUB/EO1A1190382016059110PF_AK3_01/INVSVC/ summary: Granule metadata for Entity ID: EO1A1190382016059110PF_AK3_01, Acquisition Date: 28-FEB-16, Target Path: 119, Target Row: 38')
        end
      end

      it "displays a link to download the original OpenSearch granule metadata", acceptance: true do
        click_link 'Metadata'
        within('#granule-details') do
          expect(page).to have_selector('a[href="http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=USGS_EDC_EO1_ALI:EO1A1190382016059110PF_AK3_01"]')
        end
        click_link 'Information'
      end

      context "and clicking on the metadata link" do
        before :all do
          click_link 'Metadata'
          click_on 'Native'
        end
        
        it "downloads the original OpenSearch metadata in a new window", acceptance: true do
          within_last_window do
            expect(page).not_to have_link('Back to Granules')
            expect(page.response_headers['Content-Type']).to eq('application/atom+xml;charset=UTF-8')
            metadata = page.source
            expect(metadata.include? '<?xml').to be_true
            expect(metadata.include? '<feed').to be_true
          end
        end
      end
    end

    context "on 'Information' tab" do
      it "displays only metadata fields for which the granule has data", acceptance: true do
        within('#granule-details') do
          expect(page).not_to have_content('GranuleUR:')
          expect(page).not_to have_content('Collection:')
        end
      end
    end

    context "on 'Metadata' tab" do
      before :all do
        click_link 'Metadata'
      end

      after :all do
        click_link 'Information'
      end

      it "displays no links to CMR metadata or formats", acceptance: true do
        within('#granule-details') do
          expect(page).not_to have_content('ATOM')
          expect(page).not_to have_content('ECHO10')
          expect(page).not_to have_content('ISO 19115')
        end
      end
    end
  end
end
