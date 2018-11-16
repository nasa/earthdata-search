require 'spec_helper'

describe Echo::Client do
  let(:connection) { Object.new }
  let(:req) { double(headers: {}) }
  let(:echo_rest_client) { Echo::EchoRestClient.new('http://example.com', '1234') }
  let(:echo_catalog_rest_client) { Echo::EchoCatalogRestClient.new('http://example.com', '1234') }
  let(:cmr_client) { Echo::CmrClient.new('http://example.com', '1234') }
  let(:extended_client) { Class.new(Echo::BaseClient) { def request; super; end } }

  before { allow(cmr_client).to receive(:connection).and_return(connection) }

  context 'collection search' do
    let(:collection_search_url) { "/search/collections.json" }

    context 'using free text' do
      it 'performs searches using partial matches' do
        expect(connection).to receive(:get).with(collection_search_url, keyword: "term*", :include_has_granules=>true, :include_granule_counts=>true).and_return(:response)

        response = cmr_client.get_collections(free_text: "term")
        expect(response.faraday_response).to eq(:response)
      end

      it 'partially matches any word in the free text query' do
        expect(connection).to receive(:get).with(collection_search_url, keyword: "term1* term2*", :include_has_granules=>true, :include_granule_counts=>true).and_return(:response)

        response = cmr_client.get_collections(free_text: "term1 term2")
        expect(response.faraday_response).to eq(:response)
      end

      it 'collapses whitespace in the free text query' do
        expect(connection).to receive(:get).with(collection_search_url, keyword: "term1* term2*", :include_has_granules=>true, :include_granule_counts=>true).and_return(:response)

        response = cmr_client.get_collections(free_text: "  term1\t term2 \n")
        expect(response.faraday_response).to eq(:response)
      end

      it 'escape catalog-rest reserved characters in the free text query' do
        expect(connection).to receive(:get).with(collection_search_url, keyword: "cloud_cover_\\%*", :include_has_granules=>true, :include_granule_counts=>true).and_return(:response)

        response = cmr_client.get_collections(free_text: "cloud_cover_%")
        expect(response.faraday_response).to eq(:response)
      end
    end
  end

  context 'collection details' do
    let(:collection_url) { "/search/concepts/C14758250-LPDAAC_ECS.umm_json" }
    let(:resp) { Faraday::Response.new }
    let(:body) { Object.new }
    let(:granule_url) { "http://example.com/search/granules.json" }

    it 'with valid collection ID' do
      expect(connection).to receive(:get).with(collection_url, {}).and_return(resp)

      response = cmr_client.get_collection('C14758250-LPDAAC_ECS', nil, 'umm_json')
      expect(response.faraday_response).to eq(resp)
    end
  end

  context 'granule search' do
    let(:granule_search_url) { "/search/granules.json" }
    let(:granule_search_base) { "/search/granules" }

    it 'returns data in the requested format' do
      granule_echo10_url = "#{granule_search_base}.echo10"
      expect(connection).to receive(:post).with(granule_echo10_url, nil).and_return(:response)

      response = cmr_client.get_granules(format: 'echo10')
      expect(response.faraday_response).to eq(:response)
    end

    it 'returns data in json format by default' do
      granule_json_url = "#{granule_search_base}.json"
      expect(connection).to receive(:post).with(granule_json_url, nil).and_return(:response)

      response = cmr_client.get_granules()
      expect(response.faraday_response).to eq(:response)
    end

    it 'filters granules by a supplied ECHO collection id' do
      expect(req).to receive(:body=).with('echo_collection_id%5B%5D=1234')
      expect(connection).to receive(:post).with(granule_search_url, nil).and_yield(req).and_return(:response)

      response = cmr_client.get_granules(echo_collection_id: ['1234'])
      expect(response.faraday_response).to eq(:response)
    end

    it 'filters granules by browse only flag' do
      expect(req).to receive(:body=).with('browse_only=true')
      expect(connection).to receive(:post).with(granule_search_url, nil).and_yield(req).and_return(:response)

      response = cmr_client.get_granules(browse_only: 'true')
      expect(response.faraday_response).to eq(:response)
    end
  end

  context 'collection facets' do
    let(:collection_facets_url) { "/search/collections.json" }

    it 'returns collection facets in json format' do
      expect(connection).to receive(:get).with(collection_facets_url, {:include_facets=>'v2', :page_size=>1, :include_has_granules=>true, :include_granule_counts=>true}).and_return(:response)

      response = cmr_client.get_facets()
      expect(response.faraday_response).to eq(:response)
    end

    it 'returns collection facets with a filter' do
      expect(connection).to receive(:get).with(collection_facets_url, {:campaign=>["Aqua"], :include_facets=>"v2", :page_size=>1, :include_has_granules=>true, :include_granule_counts=>true}).and_return(:response)

      response = cmr_client.get_facets(campaign: ["Aqua"])
      expect(response.faraday_response).to eq(:response)
    end
  end

  context 'headers' do
    let(:basic_client) do
      # New class with a public request method
      Class.new(Echo::BaseClient) do
        def request(*args)
          super(*args)
        end
      end.new(nil, nil)
    end

    let(:dummy_url) { '/dummy' }
    before { allow(basic_client).to receive(:connection).and_return(connection) }

    it 'defaults Content-Type to application/json for POST requests' do
      expect(connection).to receive(:post).with(dummy_url, nil).and_yield(req)

      basic_client.request(:post, dummy_url, nil, nil, {}, {})
      expect(req.headers['Content-Type']).to eq('application/json')
    end

    it 'does not default Content-Type for GET requests' do
      expect(connection).to receive(:get).with(dummy_url, nil).and_yield(req)

      basic_client.request(:get, dummy_url, nil, nil, {}, {})
      expect(req.headers['Content-Type']).to be_nil
    end

  end

end
