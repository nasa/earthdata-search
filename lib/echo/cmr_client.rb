module Echo
  class CmrClient < BaseClient
    def get_cmr_availability
      get("/search/health")
    end

    def get_collections(options={}, token=nil)
      format = options.delete(:format) || 'json'
      query = options_to_collection_query(options).merge(include_has_granules: true, include_granule_counts: true)
      get("/search/collections.#{format}", query, token_header(token))
    end

    def get_collection(id, token=nil, format='echo10')
      response = get("/search/concepts/#{id}.#{format}", {}, token_header(token))
      response.body[0].granule_url = @root + "/search/granules.json" if response.body.is_a?(Array) && response.body.first.respond_to?(:granule_url)
      response
    end

    def get_granules(options={}, token=nil)
      options = options.dup
      attrs = translate_attr_params(options)
      format = options.delete(:format) || 'json'
      body = options_to_granule_query(options)
      headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      query = body.to_query
      post("/search/granules.#{format}", "#{query}&#{attrs.join("&")}", headers)
    end

    def get_first_granule(collection, options={}, token=nil)
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

    def get_granule(id, options={}, token=nil)
      get("/search/concepts/#{id}.echo10", {}, token_header(token))
    end

    def get_facets(options={}, token=nil)
      get_collections(options.merge(include_facets: true, page_size: 1), token)
    end

    def post_timeline(options={}, token=nil)
      options = options.dup
      attrs = translate_attr_params(options)
      options['concept_id'] = options.delete("echo_collection_id")
      format = options.delete(:format) || 'json'
      query = options_to_granule_query(options).to_query
      headers = token_header(token).merge('Content-Type' => 'application/x-www-form-urlencoded')
      post("/search/granules/timeline.#{format}", "#{query}&#{attrs.join("&")}", headers)
    end

    def add_tag(key, value, condition, token)
      return add_tag_legacy(key, value, condition, token) if @use_legacy_tag_api
      query = tag_condition_to_query(condition)
      response = post("/search/tags/#{key}/associations/by_query", query.to_json, token_header(token))
      unless response.success? || !key.present?
        response = add_tag_legacy(key, value, condition, token)
        @use_legacy_tag_api = true if response.success?
      end
      response
    end

    def add_tag_legacy(key, value, condition, token)
      query = tag_condition_to_query(condition)
      tag_response = get_tag(key, token)
      response = nil
      if tag_response.success? && tag_response.body['items'].size == 1
        key = tag_response.body['items'].first['concept-id']
        response = post("/search/tags/#{key}/associations/by_query", query.to_json, token_header(token))
      end
      response || tag_response
    end

    def remove_tag(key, condition, token)
      return remove_tag_legacy(key, condition, token) if @use_legacy_tag_api
      query = tag_condition_to_query(condition)
      response = delete("/search/tags/#{key}/associations/by_query", {}, query.to_json, token_header(token))
      unless response.success? || !key.present?
        response = remove_tag_legacy(key, condition, token)
        @use_legacy_tag_api = true if response.success?
      end
      response
    end

    def remove_tag_legacy(key, condition, token)
      query = tag_condition_to_query(condition)
      tag_response = get_tag(key, token)
      response = nil
      if tag_response.success? && tag_response.body['items'].size == 1
        key = tag_response.body['items'].first['concept-id']
        response = delete("/search/tags/#{key}/associations/by_query", {}, query.to_json, token_header(token))
      end
      response || tag_response
    end

    def get_tag(key, token)
      get('/search/tags', {'tag-key' => key}, token_header(token))
    end

    def create_tag(key, token)
      post('/search/tags', {'tag-key' => key}.to_json, token_header(token))
    end

    def create_tag_if_needed(key, token)
      response = get_tag(key, token)
      unless response.success? && response.body['items'].present?
        create_tag(key, token)
      end
      nil
    end

    protected

    def translate_attr_params(options)
      # TODO this translation can be removed once CMR fixed CMR-2755
      attrs = []
      options.delete('attribute').each do |attr_opt|
        if attr_opt
          if attr_opt['value']
            attrs.push "attribute[]=#{attr_opt['type']},#{CGI.escape(attr_opt['name'].gsub(/,/, '\,'))},#{CGI.escape(attr_opt['value'])}"
          else
            attrs.push "attribute[]=#{attr_opt['type']},#{CGI.escape(attr_opt['name'].gsub(/,/, '\,'))},#{CGI.escape(attr_opt['minValue'])},#{CGI.escape(attr_opt['maxValue'])}"
          end
        end
      end
      attrs
    end

    def tag_condition_to_query(condition)
      if condition.is_a?(String) || condition.is_a?(Array)
        id_conditions = Array.wrap(condition).map { |c| {:concept_id => c} }
        condition = {or: id_conditions}
      end
      {condition: condition}
    end

    def default_headers
      {'Client-Id' => client_id, 'Echo-ClientId' => client_id}
    end
  end
end
