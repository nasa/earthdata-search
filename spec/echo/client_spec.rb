require 'spec_helper'

describe Echo::Client do
  let(:connection) { Object.new }

  context 'HTTP connection' do
    it 'is reused within a single thread' do
      expect(Echo::Client).to receive(:build_connection).once.and_return(connection)
      Echo::Client.connection
      Echo::Client.connection
    end

    it 'is not shared across threads' do
      expect(Echo::Client).to receive(:build_connection).twice.and_return(connection)

      thread = Thread.new {
        Echo::Client.connection
        Echo::Client.connection
      }
      thread.join(2)
      thread = Thread.new {
        Echo::Client.connection
        Echo::Client.connection
      }
      thread.join(2)
    end
  end

  context 'dataset search' do
    let(:dataset_search_url) { "/catalog-rest/echo_catalog/datasets.json" }
    before { allow(Echo::Client).to receive(:connection).and_return(connection) }

    context 'using free text' do
      it 'performs searches using partial matches' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term%").and_return(:response)

        response = Echo::Client.get_datasets(free_text: "term")
        expect(response.faraday_response).to eq(:response)
      end

      it 'partially matches any word in the free text query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term1% term2%").and_return(:response)

        response = Echo::Client.get_datasets(free_text: "term1 term2")
        expect(response.faraday_response).to eq(:response)
      end

      it 'collapses whitespace in the free text query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term1% term2%").and_return(:response)

        response = Echo::Client.get_datasets(free_text: "  term1\t term2 \n")
        expect(response.faraday_response).to eq(:response)
      end

      it 'escape catalog-rest reserved characters in the free text query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "cloud\\_cover\\_\\%%").and_return(:response)

        response = Echo::Client.get_datasets(free_text: "cloud_cover_%")
        expect(response.faraday_response).to eq(:response)
      end
    end
  end

  context 'dataset details' do
    let(:dataset_url) { "/catalog-rest/echo_catalog/datasets/C14758250-LPDAAC_ECS.echo10" }
    before { allow(Echo::Client).to receive(:connection).and_return(connection) }

    it 'with valid dataset ID' do
      expect(connection).to receive(:get).with(dataset_url, {}).and_return(:response)

      response = Echo::Client.get_dataset('C14758250-LPDAAC_ECS')
      expect(response.faraday_response).to eq(:response)
    end
  end

  context 'granule search' do
    let(:granule_search_url) { "/catalog-rest/echo_catalog/granules.json" }
    let(:granule_search_base) { "/catalog-rest/echo_catalog/granules" }
    before { allow(Echo::Client).to receive(:connection).and_return(connection) }

    it 'returns data in the requested format' do
      granule_echo10_url = "#{granule_search_base}.echo10"
      expect(connection).to receive(:get).with(granule_echo10_url, {}).and_return(:response)

      response = Echo::Client.get_granules(format: 'echo10')
      expect(response.faraday_response).to eq(:response)
    end

    it 'returns data in json format by default' do
      granule_json_url = "#{granule_search_base}.json"
      expect(connection).to receive(:get).with(granule_json_url, {}).and_return(:response)

      response = Echo::Client.get_granules()
      expect(response.faraday_response).to eq(:response)
    end

    it 'filters granules by a supplied ECHO collection id' do
      expect(connection).to receive(:get).with(granule_search_url, echo_collection_id: ['1234']).and_return(:response)

      response = Echo::Client.get_granules(echo_collection_id: ['1234'])
      expect(response.faraday_response).to eq(:response)
    end

    it 'filters granules by browse only flag' do
      expect(connection).to receive(:get).with(granule_search_url, browse_only: 'true').and_return(:response)

      response = Echo::Client.get_granules(browse_only: 'true')
      expect(response.faraday_response).to eq(:response)
    end
  end

  context 'dataset facets' do
    let(:dataset_facets_url) { "/catalog-rest/search_facet.json" }
    before { allow(Echo::Client).to receive(:connection).and_return(connection) }

    it 'returns dataset facets in json format' do
      expect(connection).to receive(:get).with(dataset_facets_url, {}).and_return(:response)

      response = Echo::Client.get_facets()
      expect(response.faraday_response).to eq(:response)
    end

    it 'returns dataset facets with a filter' do
      expect(connection).to receive(:get).with(dataset_facets_url, {:campaign=>["AQUA"], :options=>{:campaign=>{:and=>true}}}).and_return(:response)

      response = Echo::Client.get_facets(campaign: ["AQUA"])
      expect(response.faraday_response).to eq(:response)
    end
  end

end
