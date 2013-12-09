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

  context 'dataset searches' do
    let(:dataset_search_url) { "/catalog-rest/echo_catalog/datasets.json" }
    before { allow(Echo::Client).to receive(:connection).and_return(connection) }

    context 'using keywords' do
      it 'performs searches using partial keyword matches' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term%").and_return(:response)

        response = Echo::Client.get_datasets(keywords: "term")
        expect(response).to eq(:response)
      end

      it 'partially matches any word in the keyword query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term1% term2%").and_return(:response)

        response = Echo::Client.get_datasets(keywords: "term1 term2")
        expect(response).to eq(:response)
      end

      it 'collapses whitespace in the keyword query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "term1% term2%").and_return(:response)

        response = Echo::Client.get_datasets(keywords: "  term1\t term2 \n")
        expect(response).to eq(:response)
      end

      it 'escaped catalog-rest reserved characters in the keyword query' do
        expect(connection).to receive(:get).with(dataset_search_url, keyword: "cloud\\_cover\\_\\%%").and_return(:response)

        response = Echo::Client.get_datasets(keywords: "cloud_cover_%")
        expect(response).to eq(:response)
      end
    end
  end

  context 'dataset details' do
    let(:dataset_url) { "/catalog-rest/echo_catalog/datasets/C14758250-LPDAAC_ECS.echo10" }
    before { allow(Echo::Client).to receive(:connection).and_return(connection) }

    it 'with valid dataset ID' do
      expect(connection).to receive(:get).with(dataset_url, {}).and_return(:response)

      response = Echo::Client.get_dataset('C14758250-LPDAAC_ECS')
      expect(response).to eq(:response)
    end
  end

end
