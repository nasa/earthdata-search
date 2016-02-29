module Echo
  class CwicClient < BaseClient
    def get_granules(params)
      get("/opensearch/granules.atom", params)
    end

    def get_osdd(params)
      get('/opensearch/granules.atom', params)
    end

    private

  end
end
