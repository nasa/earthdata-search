require 'json'

module Helpers
  module MockHelpers
    def mock_get_collections(file_id)
      data = JSON.parse(File.read(Rails.root.join('fixtures', 'mock_data', "#{file_id}.json")))

      collection_response = MockResponse.get_collections(data)
      mock_client = Object.new
      allow(Echo::Client).to receive('client_for_environment').and_return(mock_client)
      expect(mock_client).to receive('get_collections').and_return(collection_response)
    end
  end
end
