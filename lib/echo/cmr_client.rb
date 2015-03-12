module Echo
  class CmrClient < BaseClient
    def get_datasets(options={}, token=nil)
      format = options.delete(:format) || 'json'
      query = options_to_dataset_query(options).merge(include_has_granules: true, include_granule_counts: true)
      get("/search/collections.#{format}", query, token_header(token))
    end

    def get_dataset(id, options={}, token=nil)
      response = get("/search/concepts/#{id}.echo10", {}, token_header(token))
      response.body[0].granule_url = @root + "/search/granules.json" if response.body.is_a?(Array) && response.body.first.respond_to?(:granule_url)
      response
    end

    def get_granules(options={}, token=nil)
      options = options.dup
      format = options.delete(:format) || 'json'
      body = options_to_granule_query(options)
      headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      post("/search/granules.#{format}", body.to_query, headers)
    end

    def get_granule(id, options={}, token=nil)
      get("/search/concepts/#{id}.echo10", {}, token_header(token))
    end

    def get_facets(options={}, token=nil)
      get_datasets(options.merge(include_facets: true, page_size: 1), token)
    end

    def post_timeline(options={}, token=nil)
      options = options.dup
      options['concept_id'] = options.delete("echo_collection_id")
      format = options.delete(:format) || 'json'
      query = options_to_granule_query(options)
      headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      post("/search/granules/timeline.#{format}", query.to_query, headers)
    end
  end
end
