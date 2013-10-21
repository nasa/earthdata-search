module Echo
  # Register custom middleware
  Faraday.register_middleware(:response,
                              :logging => Echo::ClientMiddleware::LoggingMiddleware,
                              :atom_datasets => Echo::ClientMiddleware::AtomDatasetMiddleware)

  class Client
    include Echo::QueryTransformations

    CATALOG_URL="https://api.echo.nasa.gov"

    def self.get_datasets(options={})
      connection.get('/catalog-rest/echo_catalog/datasets.json', options_to_query(options))
    end

    def self.connection
      Thread.current[:edsc_echo_connection] ||= self.build_connection
    end

    private

    def self.build_connection
      Faraday.new(:url => CATALOG_URL) do |conn|
        conn.response :logging

        # The order of these handlers is important.  They are run last to first.
        # Our parsers depend on JSON / XML being converted to objects by earlier
        # parsers.
        conn.response :atom_datasets, :content_type => /\bjson$/
        conn.response :json, :content_type => /\bjson$/

        conn.adapter  Faraday.default_adapter
      end
    end
  end
end
