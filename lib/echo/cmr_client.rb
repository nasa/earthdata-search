module Echo
  class CmrClient < BaseClient
    def get_cmr_availability
      get('/search/health')
    end

    def get_cmr_search_availability
      get('/search/collections.json')
    end

    def get_opensearch_availability
      get('/opensearch')
    end

    def get_collections(options = {}, token = nil)
      format = options.delete(:format) || 'json'
      query = options_to_collection_query(options).merge(include_has_granules: true, include_granule_counts: true)
      get("/search/collections.#{format}", query, token_header(token).merge('cmr-prototype-umm' => 'true'))
    end

    def get_service(id, options = {}, token = nil)
      get("/search/concepts/#{id}", {}, token_header(token).merge('cmr-prototype-umm' => 'true'))
    end

    def json_query_collections(query, token = nil, options = {})
      format = options.delete(:format) || 'json'
      post("/search/collections.#{format}?#{options.to_param}", query.to_json, token_header(token))
    end

    def get_collection(id, token = nil, format = 'echo10')
      get("/search/concepts/#{id}.#{format}", {}, token_header(token))
    end

    def get_granules(options = {}, token = nil)
      options = options.dup
      format = options.delete(:format) || 'json'
      body = options_to_granule_query(options)
      headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      query = body.to_query
      post("/search/granules.#{format}", query, headers)
    end

    def get_first_granule(collection, options = {}, token = nil)
      id = collection
      id = collection['id'] unless id.is_a?(String)
      defaults = {
        format: 'json',
        echo_collection_id: [id],
        page_size: 1,
        sort_key: ['-start_date']
      }
      response = get_granules(defaults.merge(options))
      if response.success? && response.body['feed'] && response.body['feed']['entry'].present?
        response.body['feed']['entry'].first
      else
        nil
      end
    end

    def get_granule(id, options = {}, token = nil)
      get("/search/concepts/#{id}.echo10", {}, token_header(token))
    end

    def get_facets(options = {}, token = nil)
      get_collections(options.merge(include_facets: 'v2', page_size: 1), token)
    end

    def post_timeline(options = {}, token = nil)
      options = options.dup
      options['concept_id'] = options.delete('echo_collection_id')
      format = options.delete(:format) || 'json'
      query = options_to_granule_query(options).to_query
      headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      post("/search/granules/timeline.#{format}", query, headers)
    end

    # Add a tag with the given key and data value to all collections matching the
    # query condition. If append is true, this method will append the value to any
    # existing data (if not already present), rather than overwriting it. The optional
    # block gets passed Array#uniq to determine whether a piece of data is already
    # present in the tag. Newer versions of data will overwrite older ones.
    def add_tag(key, value, condition, token, append = false, only_granules = true, &block)
      query = tag_condition_to_query(condition)
      # https://bugs.earthdata.nasa.gov/browse/CMR-2855 will fix the need for some of this logic
      # https://bugs.earthdata.nasa.gov/browse/CMR-2609 as well
      if value.present? || only_granules
        query_params = { include_tags: key, include_has_granules: true }
        response = json_query_collections(condition, token, query_params)
        return response unless response.success? && response.body['feed']['entry'].present?

        entries = response.body['feed']['entry']
        entries = entries.select { |entry| entry['has_granules'] } if only_granules
        assoc_data = nil
        if append
          data = Array.wrap(value)
          assoc_data = entries.map do |entry|
            tags = entry['tags']
            data = Array.wrap(tags[key]['data']) + data if tags && tags[key]
            # Ensure no duplicate values and that newer values overwrite older ones
            data = data.reverse.uniq(&block).reverse
            { 'concept-id' => entry['id'], 'data' => data }
          end
        elsif value.present?
          assoc_data = entries.map { |entry| { 'concept-id' => entry['id'], 'data' => value } }
        else
          assoc_data = entries.map { |entry| { 'concept-id' => entry['id'] } }
        end
        if assoc_data.present?
          response = post("/search/tags/#{key}/associations", assoc_data.to_json, token_header(token))
        end
      else
        response = post("/search/tags/#{key}/associations/by_query", query.to_json, token_header(token))
      end
      response
    end

    def bulk_remove_tag(key, assoc_data, token)
      delete("/search/tags/#{key}/associations", {}, assoc_data.to_json, token_header(token))
    end

    def remove_tag(key, condition, token)
      query = tag_condition_to_query(condition)
      delete("/search/tags/#{key}/associations/by_query", {}, query.to_json, token_header(token))
    end

    def get_tag(key, token)
      get('/search/tags', { 'tag-key' => key }, token_header(token))
    end

    def create_tag(key, token)
      post('/search/tags', { 'tag-key' => key }.to_json, token_header(token))
    end

    def create_tag_if_needed(key, token)
      response = get_tag(key, token)
      unless response.success? && response.body['items'].present?
        create_tag(key, token)
      end
      nil
    end

    protected

    def tag_condition_to_query(condition)
      if condition.is_a?(String) || condition.is_a?(Array)
        id_conditions = Array.wrap(condition).map { |c| { concept_id: c } }
        condition = { or: id_conditions }
      end
      unless condition.key?('condition') || condition.key?(:condition)
        condition = { condition: condition }
      end
      condition
    end

    def default_headers
      { 'Client-Id' => client_id, 'Echo-ClientId' => client_id }
    end
  end
end
