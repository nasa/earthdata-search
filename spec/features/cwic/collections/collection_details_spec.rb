require 'spec_helper'

describe 'CWIC-enabled collection details', reset: false do
  before :all do
    Capybara.reset_sessions!

    load_page :search, q: 'C1220566654-USGS_LTA', ac: true
  end

  context 'When viewing the collection details for a CWIC-enabled collection' do
    before :all do
      first_collection_result.click_link('View collection details')
      wait_for_xhr

      click_on 'For developers'
    end

    it 'displays links with the correct text to the collection\'s CWIC OpenSearch API endpoint' do
      expect(collection_details).to have_link('OSDD')
    end

    it 'displays links with the correct url to the collection\'s CWIC OpenSearch API endpoint' do
      url = 'http://cwic.wgiss.ceos.org/opensearch/datasets/C1220566654-USGS_LTA/osdd.xml?clientId='
      expect(collection_details.find_link('OSDD')['href']).to start_with(url)
    end

    it 'does not display links to the CMR\'s granule search API endpoint' do
      expect(collection_details).to have_no_link('CMR')
    end
  end
end
