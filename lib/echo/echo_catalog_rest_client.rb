module Echo
  class EchoCatalogRestClient < BaseClient
    def get_provider_holdings
      get('echo_catalog/provider_holdings.json')
    end

    protected

    def default_headers
      { 'Client-Id' => client_id, 'Echo-ClientId' => client_id }
    end
  end
end
