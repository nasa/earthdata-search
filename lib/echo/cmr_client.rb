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

    ##
    # Search methods
    ##
    def get_collections(options = {}, token = nil)
      stringified_options = options.stringify_keys
      query = options_to_collection_query(stringified_options).merge(include_has_granules: true, include_granule_counts: true)

      format = stringified_options.delete('format') || 'json'
      headers = token_header(token).merge('Accept': "application/vnd.nasa.cmr.umm_results+json; version=#{Rails.configuration.umm_c_version}")
      get("/search/collections.#{format}", query, headers)
    end

    def get_variables(options = {}, token = nil)
      stringified_options = options.stringify_keys

      format = stringified_options.delete('cmr_format') || 'json'
      headers = token_header(token).merge('Content-Type': 'application/x-www-form-urlencoded', 'Accept': "application/vnd.nasa.cmr.umm_results+json; version=#{Rails.configuration.umm_var_version}")
      post("search/variables.#{format}", stringified_options.to_query, headers)
    end

    def get_services(options = {}, token = nil)
      stringified_options = options.stringify_keys

      format = stringified_options.delete('cmr_format') || 'umm_json'
      headers = token_header(token).merge('Accept': "application/vnd.nasa.cmr.umm_results+json; version=#{Rails.configuration.umm_s_version}")
      get("/search/services.#{format}", stringified_options, headers)
    end

    ##
    # Single concept methods
    ##
    def get_collection(id, token = nil, format = 'umm_json')
      get_concept(id, token: token, format: format, headers: { 'Accept': "application/vnd.nasa.cmr.umm_results+json; version=#{Rails.configuration.umm_c_version}" })
    end

    def get_variable(id, token = nil, format = 'umm_json')
      get_concept(id, token: token, format: format, headers: { 'Accept': "application/vnd.nasa.cmr.umm_results+json; version=#{Rails.configuration.umm_var_version}" })
    end

    def get_service(id, token = nil, format = 'umm_json')
      get_concept(id, token: token, format: format, headers: { 'Accept': "application/vnd.nasa.cmr.umm_results+json; version=#{Rails.configuration.umm_s_version}" })
    end

    # Get a single concept by concept id
    def get_concept(id, token: nil, format: 'umm_json', headers: {})
      headers = token_header(token).merge(headers)

      get("/search/concepts/#{id}.#{format}", {}, headers)
    end

    def json_query_collections(query, token = nil, options = {})
      format = options.delete(:format) || 'json'
      post("/search/collections.#{format}?#{options.to_param}", query.to_json, token_header(token))
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
      response = get_granules(defaults.merge(options), token)
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
        return response if collection_has_tag?(response, value)

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

    def create_tags_if_needed(keys, token)
      response = get_tag(keys, token)

      unless response.success? && response.body['items'].present?
        existing_keys = response.body['items'].map { |tag| tag[:tag_key] }

        keys.each do |new_tag|
          if existing_keys.include?(new_tag)
            puts "#{new_tag} is already a thing"
          end
          create_tag(new_tag, token) unless existing_keys.include?(new_tag)
        end
      end
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

    # Check if a collection search response includes tag_data
    def collection_has_tag?(collection_response, tag_data)
      collection_response.body['feed']['entry'].each do |collection|
        collection.fetch('tags', {}).fetch('edsc.extra.gibs', {}).fetch('data', []).each do |collection_tag_data|
          return true if collection_tag_data == JSON.parse(tag_data.to_json)
        end
      end
      false
    end
  end
end
