require "spec_helper"

describe "CWIC-enabled collection details", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search, env: :sit, facets: true
    login
    wait_for_xhr
    find("p.facets-item", text: "Int'l / Interagency").click
  end

  after :all do
    Capybara.reset_sessions!
  end

  context "viewing the collection details for a CWIC-tagged collection" do
    use_collection 'C1000003579-GCMDTEST', '3DIMG_L2P_IRW'

    before :all do
      first_collection_result.click_link('View collection details')
      wait_for_xhr
    end

    after :all do
      click_link "Back to Collections"
    end

    it "displays links to the collection's CWIC OpenSearch API endpoint", acceptance: true do
      expect(collection_details).to have_link('OSDD')
      url = "http://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=3DIMG_L2P_IRW&clientId="
      expect(collection_details.find_link('OSDD')['href']).to start_with(url)
    end

    it "does not display links to the CMR's granule search API endpoint", acceptance: true do
      expect(collection_details).to have_no_link('CMR')
    end
  end

end
