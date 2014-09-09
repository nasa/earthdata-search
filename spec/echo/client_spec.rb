require 'spec_helper'

describe Echo::Client do
  let(:connection) { Object.new }
  let(:req) { double(headers: {}) }
  let(:echo_client) { Echo::EchoClient.new('http://example.com', '1234') }

  context 'dataset search' do
    let(:dataset_search_url) { "/catalog-rest/echo_catalog/datasets.json" }
    before { allow(echo_client).to receive(:connection).and_return(connection) }

    context 'using free text' do
      it 'performs searches using partial matches' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term%").and_return(:response)

        response = echo_client.get_datasets(free_text: "term")
        expect(response.faraday_response).to eq(:response)
      end

      it 'partially matches any word in the free text query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term1% term2%").and_return(:response)

        response = echo_client.get_datasets(free_text: "term1 term2")
        expect(response.faraday_response).to eq(:response)
      end

      it 'collapses whitespace in the free text query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term1% term2%").and_return(:response)

        response = echo_client.get_datasets(free_text: "  term1\t term2 \n")
        expect(response.faraday_response).to eq(:response)
      end

      it 'escape catalog-rest reserved characters in the free text query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "cloud\\_cover\\_\\%%").and_return(:response)

        response = echo_client.get_datasets(free_text: "cloud_cover_%")
        expect(response.faraday_response).to eq(:response)
      end
    end
  end

  context 'dataset details' do
    let(:dataset_url) { "/catalog-rest/echo_catalog/datasets/C14758250-LPDAAC_ECS.echo10" }
    before { allow(echo_client).to receive(:connection).and_return(connection) }

    it 'with valid dataset ID' do
      expect(connection).to receive(:get).with(dataset_url, {}).and_return(:response)

      response = echo_client.get_dataset('C14758250-LPDAAC_ECS')
      expect(response.faraday_response).to eq(:response)
    end
  end

  context 'granule search' do
    let(:granule_search_url) { "/catalog-rest/echo_catalog/granules.json" }
    let(:granule_search_base) { "/catalog-rest/echo_catalog/granules" }
    before { allow(echo_client).to receive(:connection).and_return(connection) }

    it 'returns data in the requested format' do
      granule_echo10_url = "#{granule_search_base}.echo10"
      expect(connection).to receive(:post).with(granule_echo10_url, nil).and_return(:response)

      response = echo_client.get_granules(format: 'echo10')
      expect(response.faraday_response).to eq(:response)
    end

    it 'returns data in json format by default' do
      granule_json_url = "#{granule_search_base}.json"
      expect(connection).to receive(:post).with(granule_json_url, nil).and_return(:response)

      response = echo_client.get_granules()
      expect(response.faraday_response).to eq(:response)
    end

    it 'filters granules by a supplied ECHO collection id' do
      expect(req).to receive(:body=).with('echo_collection_id%5B%5D=1234')
      expect(connection).to receive(:post).with(granule_search_url, nil).and_yield(req).and_return(:response)

      response = echo_client.get_granules(echo_collection_id: ['1234'])
      expect(response.faraday_response).to eq(:response)
    end

    it 'filters granules by browse only flag' do
      expect(req).to receive(:body=).with('browse_only=true')
      expect(connection).to receive(:post).with(granule_search_url, nil).and_yield(req).and_return(:response)

      response = echo_client.get_granules(browse_only: 'true')
      expect(response.faraday_response).to eq(:response)
    end
  end

  context 'dataset facets' do
    let(:dataset_facets_url) { "/catalog-rest/search_facet.json" }
    before { allow(echo_client).to receive(:connection).and_return(connection) }

    it 'returns dataset facets in json format' do
      expect(connection).to receive(:get).with(dataset_facets_url, {}).and_return(:response)

      response = echo_client.get_facets()
      expect(response.faraday_response).to eq(:response)
    end

    it 'returns dataset facets with a filter' do
      expect(connection).to receive(:get).with(dataset_facets_url, {:campaign=>["AQUA"], :options=>{:campaign=>{:and=>true}}}).and_return(:response)

      response = echo_client.get_facets(campaign: ["AQUA"])
      expect(response.faraday_response).to eq(:response)
    end
  end

end
