require 'json'

module Helpers
  module MockHelpers
    def mock_get_collections(directory)
      data = JSON.parse(File.read(Rails.root.join('fixtures', 'mock_data', directory, 'collections_results.json')))

      collections_response = MockResponse.get_collections(data)
      mock_client = Object.new
      allow(Echo::Client).to receive('client_for_environment').and_return(mock_client)
      expect(mock_client).to receive('get_collections').at_least(:once).and_return(collections_response)
    end

    def mock_get_collection(directory)
      collections_data = JSON.parse(File.read(Rails.root.join('fixtures', 'mock_data', directory, 'collections_results.json')))
      collection_data = JSON.parse(File.read(Rails.root.join('fixtures', 'mock_data', directory, 'collection_result.json')))

      collections_response = MockResponse.get_collections(collections_data)
      collection_response = MockResponse.get_collection(collection_data)

      mock_client = Object.new
      allow(Echo::Client).to receive('client_for_environment').and_return(mock_client)
      expect(mock_client).to receive('get_collections').and_return(collections_response)
      expect(mock_client).to receive('get_collection').and_return(collection_response)
    end
  end
end
