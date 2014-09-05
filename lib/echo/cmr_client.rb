module Echo
  class CmrClient < BaseClient
    def get_datasets(options={}, token=nil)
      format = options.delete(:format) || 'json'
      query = options_to_dataset_query(options).merge(include_has_granules: true, include_granule_counts: true)
      get("/search/collections.#{format}", query, token_header(token))
    end

    def get_dataset(id, options={}, token=nil)
      get("/search/concepts/#{id}.echo10", {}, token_header(token))
    end

    def get_granules(options={}, token=nil)
      options = options.dup
      format = options.delete(:format) || 'json'
      body = options_to_granule_query(options)
      headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      post("/search/granules.#{format}", body.to_query, headers)
    end

    def get_granule(id, options={}, token=nil)
      get("/search/granules/#{id}.echo10", {}, token_header(token))
    end

    def get_facets(options={}, token=nil)
      get_datasets(options.merge(include_facets: true, page_size: 1), token)
    end

    # CMR-379, scheduled for sprint 13
    #def post_timeline(options={}, token=nil)
    #  get_granules(options.merge(include_timeline: true, page_size: 1), token)
    #end
  end
end
