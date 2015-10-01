class DatasetsController < ApplicationController
  respond_to :json

  KEYWORD_CHILD = {'topic' => 'term', 'term' => 'variable_level_1', 'variable_level_1' => 'variable_level_2', 'variable_level_2' => 'variable_level_3', 'variable_level_3' => nil}

  def index
    start = (Time.now.to_f * 1000).to_i
    # FIXME Temporary workaround for CMR-2038 and CMR-2049
    # Fire two requests to CMR. One to retrieve hierarchical facets, the other to get non-hierarchical facets, in parallel.
    execute_hierarchical_search = lambda {hierarchical_search()}
    execute_non_hierarchical_search = lambda {non_hierarchical_search()}
    catalog_response = execute_search(execute_hierarchical_search, execute_non_hierarchical_search)

    if (200..299).include? catalog_response.code.to_i
      add_featured_datasets!(dataset_params_for_request(request), token, catalog_response.body)
      catalog_response.body['feed']['facets'] = facet_results(request, catalog_response)

      DatasetExtra.decorate_all(catalog_response.body['feed']['entry'])

      catalog_response.header.each do |key, value|
        response.headers[key] = value if key.start_with?('cmr-')
      end
    end

    Rails.logger.debug "Total time: #{(Time.now.to_f * 1000).to_i - start} ms"

    respond_with(catalog_response.body, status: catalog_response.code)
  end

  def show
    response = echo_client.get_dataset(params[:id], token)

    use_dataset(params[:id])

    if response.success?
      respond_with(DatasetDetailsPresenter.new(response.body.first, params[:id], token, echo_env), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  def use
    result = use_dataset(params[:id])
    render :json => result, status: :ok
  end

  def facets
    response = echo_client.get_facets(dataset_params_for_request(request), token)

    if response.success?
      respond_with(facet_results(request, response), status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end

  private

  def hierarchical_search
    service_config = Rails.configuration.services['earthdata'][echo_env]
    root = service_config['cmr_root']
    get_datasets(root, dataset_params_for_request(request), token)
  end

  def non_hierarchical_search
    service_config = Rails.configuration.services['earthdata'][echo_env]
    root = service_config['cmr_root']
    get_datasets(root, dataset_params_for_request(request, false), token)
  end

  def get_datasets(root, options={}, token=nil)
    format = options.delete(:format) || 'json'
    query = options.merge(include_has_granules: true, include_granule_counts: true)
    http_get("#{root}/search/collections.#{format}", query, token)
  end

  def http_get(path, params, token)
    uri = URI.parse(path)
    uri.query = encode(params)
    req = Net::HTTP::Get.new(uri.request_uri)
    req["Echo-Token"] = token unless token.nil?
    req['Client-Id'] = Rails.configuration.cmr_client_id
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request req
    end
  end

  def encode(value, key = nil)
    case value
      when Hash then value.map { |k,v| encode(v, key.nil? ? k : "#{key}[#{k.to_s}]") }.join('&')
      when Array then value.map { |v| encode(v, "#{key}[]") }.join('&')
      when nil then ''
      else
        "#{key}=#{CGI.escape(value.to_s)}"
    end
  end

  # This connection is cached as a thread local variable so subsequent calls to this method from the same thread will
  # return the same instance.
  # However it is commented out on a second thought. This might bring into too much overheads and not be what we need.
  # def send_request(uri, request)
  #   begin
  #     key = [uri.host, uri.port, use_ssl: uri.scheme == 'https']
  #     Thread.current[key.to_s] ||= Net::HTTP.new(*key)
  #     Thread.current[key.to_s].request(request)
  #   rescue Exception => exception
  #     Rails.logger.error("EXCEPTION - #{self.class.name}: #{exception.message}\n#{exception.inspect}\n#{exception.backtrace.join("\n")}\n")
  #   end
  # end

  def execute_search(hierarchical, non_hierarchical)
    nh_response = nil
    nh_thread = Thread.new do
      timestamp = (Time.now.to_f * 1000).to_i
      Rails.logger.debug "Started retrieving non_hierarchical facets at #{timestamp}"
      nh_response = non_hierarchical.call
      Rails.logger.debug "Completed retrieving non_hierarchical facets. Time used: #{(Time.now.to_f * 1000).to_i - timestamp}"
    end
    timestamp = (Time.now.to_f * 1000).to_i
    Rails.logger.debug "Started retrieving hierarchical facets at #{timestamp}"
    h_response = hierarchical.call
    Rails.logger.debug "Completed retrieving hierarchical facets. Time used: #{(Time.now.to_f * 1000).to_i - timestamp}"
    nh_thread.join

    # merge non_hierarchical response to hierarchical response
    h_json = JSON.parse(h_response.body)
    nh_json = JSON.parse(nh_response.body)
    h_response.body = h_json
    h_facets = h_json['feed']['facets']
    nh_facets = nh_json['feed']['facets']
    nh_archive_center = nh_facets.select {|facet| facet['field'] == 'archive_center'}
    nh_platform = nh_facets.select {|facet| facet['field'] == 'platform'}
    nh_instrument = nh_facets.select {|facet| facet['field'] == 'instrument'}
    h_facets.map! do |facet|
      if facet['field'] == 'archive_centers'
        nh_archive_center[0]
      elsif facet['field'] == 'platforms'
        nh_platform[0]
      elsif facet['field'] == 'instruments'
        nh_instrument[0]
      else
        facet
      end
    end
    h_response
  end

  def facet_results(request, response)
    # Hash of parameters to values where hashes and arrays in parameter names are not interpreted
    query = request.query_string.gsub('%5B', '[').gsub('%5D', ']').split('&').map {|kv| kv.split('=')}.group_by(&:first)

    # CMR Facets
    facets = Array.wrap(response.body['feed']['facets'])

    fields_to_params = {
      'two_d_coordinate_system_name' => ['2D Coordinate Name', 'two_d_coordinate_system_name[]'],
      # 'category' => ['Category Keyword', 'science_keywords[0][category][]'],
      'topic' => ['Topic Keyword', 'science_keywords[0][topic][]'],
      'term' => ['Term Keyword', 'science_keywords[0][term][]'],
      'variable_level_1' => ['Variable Level 1 Keyword', 'science_keywords[0][variable_level_1][]'],
      'variable_level_2' => ['Variable Level 2 Keyword', 'science_keywords[0][variable_level_2][]'],
      'variable_level_3' => ['Variable Level 3 Keyword', 'science_keywords[0][variable_level_3][]'],
      'detailed_variable' => ['Detailed Variable Keyword', 'science_keywords[0][detailed_variable][]']
    }

    features = [{'field' => 'features', 'value-counts' => [['Map Imagery', 0], ['Subsetting Services', 0], ['Near Real Time', 0]]}]
    facets.unshift(features).flatten!

    keyword_index = 8

    # CMR-1722 Temporarily filter out detailed_variable keywords
    # FIXME: The proposed fix to CMR-1722 may break our facets
    facets = facets.reject {|facet| facet['field'] == 'detailed_variable'}

    science_keywords_facets = facets.find {|facet| facet['field'] == 'science_keywords'}
    facets.delete(science_keywords_facets)

    # find all science_keywords query params
    keyword_query_params = {}
    query.each {|k, v| keyword_query_params[k[/science_keywords\[0\]\[(.*)\]\[\]/, 1]] = v[0][1].gsub('+', ' ') if k.match(/science_keywords\[0\]/) }

    # add child param to the hash
    cutoff_key = nil
    KEYWORD_CHILD.keys.each do |key|
      keyword_query_params.except!(key) if cutoff_key && keyword_query_params[key]
      if keyword_query_params[key].nil?
        unless cutoff_key
          keyword_query_params[key] = '--ALL--'
          cutoff_key = key
        end
        next
      end
    end

    facet_tree = science_keywords_facets['category'].find { |facet| facet['value'] == 'EARTH SCIENCE' }['topic'] unless science_keywords_facets.nil? || science_keywords_facets['category'].nil?
    if facet_tree
      KEYWORD_CHILD.keys.each do |keyword|
        rtn_hash = parse_hierarchical_keywords(facet_tree, keyword, keyword_query_params)
        facets << rtn_hash[:value]
        break if rtn_hash[:facet_tree].nil?
        facet_tree = rtn_hash[:facet_tree]
      end
    end

    selected_keywords = []
    keyword_facets = []

    results = facets.map.with_index do |facet, index|
      if facet['value-counts'].blank?
        items = []
      else
        items = facet['value-counts'].map do |term, count|
          {'term' => term, 'count' => count}
        end
      end

      field = facet['field']
      params = fields_to_params[field]
      unless params
        params = [field.humanize.capitalize, field + '[]']
      end

      previous_applied = false
      if index < keyword_index
        facet_response(query, items, params.first, params.last)
      else
        if items.size > 0 # FIXME if no items are returned, doesn't show any selected facets
          previous_param = fields_to_params[facets[index-1]['field']]
          previous_applied = true if previous_param && query[previous_param.last]

          if query[params.last] # if current keyword param has applied facet
            selected_keyword = URI.unescape(query[params.last].flatten.last.gsub('+', ' '))
            selected_item = items.select{|facet| facet['term'] == selected_keyword}.first
            selected_item['param'] = params.last
            selected_item['term'] = selected_item['term']
            selected_item['index'] = index
            selected_keywords += [selected_item]
          elsif index == keyword_index || previous_applied # if previous keyword param has applied facet
            keyword_facets += items.map do |item|
              item['param'] = params.last
              item
            end
          else # other keywords without previously applied keywords
            nil
          end
        end
        nil
      end
    end

    keyword_facets.sort_by! {|facet| facet['term']}
    results.insert(1, {name: "Keywords", param: nil, values: selected_keywords + keyword_facets})
    # EDSC-698 Dropping sensor as a facet.
    # FIXME: This may need retouch once CMR drops the sensor facet.
    results.reject!{|facet| !facet.nil? && facet[:name] == 'Sensor'}
    results.compact
  end

  def facet_response(query, items, name, param)
    items = items[0...50]
    applied = []
    Array.wrap(query[param]).each do |param_term|
      term = param_term.last
      term = URI.unescape(term.gsub('+', ' '))
      unless items.any? {|item| item['term'] == term}
        applied << {'term' => term, 'count' => 0}
      end
    end

    items += applied

    items.sort_by! {|facet| facet['term']}
    {name: name, param: param, values: items}
  end

  def get_featured_ids
    featured_ids = DatasetExtra.featured_ids

    if current_user.present?
      recents = current_user.recent_datasets.where('echo_id not in (?)', featured_ids).limit(RECENT_DATASET_COUNT)
      featured_ids += recents.map(&:echo_id)
    else
      featured_and_recent = (featured_ids + Array.wrap(session[:recent_datasets])).uniq
      featured_ids = featured_and_recent.take(featured_ids.size + RECENT_DATASET_COUNT)
    end
  end

  def add_featured_datasets!(base_query, token, base_results)
    featured = []

    featured_ids = get_featured_ids

    # Only fetch if the user is requesting the first page
    if base_query['page_num'] == "1" && base_query['echo_collection_id'].nil?
      begin
        featured_query = dataset_params_for_request(request).merge('echo_collection_id' => featured_ids)
        featured_response = echo_client.get_datasets(featured_query, token)
        featured = featured_response.body['feed']['entry'] if featured_response.success?
      rescue => e
        # This shouldn't happen, but on the off-chance it does, retrieving featured datasets shouldn't
        # be allowed to make the whole request fail
        Rails.logger.error("Error getting featured datasets: #{e}\n#{e.backtrace.join("\n")}")
      end
    end

    if base_query['echo_collection_id'].present?
      base_results['feed']['entry'].each do |ds|
        if featured_ids.include?(ds['id'])
          ds[:featured] = true
        end
      end
    elsif featured.present?
      featured.each { |ds| ds[:featured] = true }
      base_results['feed']['entry'].delete_if { |ds| featured_ids.include?(ds['id']) }
      base_results['feed']['entry'].unshift(*featured)
    elsif base_query['echo_collection_id'].present?
      base_results['feed']['entry'].each { |ds| ds[:featured] = featured_ids.include?(ds['id']) }
    end

    base_results
  end

  def dataset_params_for_request(request, hierarchical=true)
    features = request.query_parameters['features']
    use_opendap = features && features.include?('Subsetting Services')
    params = request.query_parameters.except('features')
    params = params.merge('echo_collection_id' => Rails.configuration.services['opendap'].keys) if use_opendap

    gibs_keys = Rails.configuration.gibs.keys
    providers = gibs_keys.map{|key| key.split('___').first}
    short_names = gibs_keys.map{|key| key.split('___').last}

    use_gibs = features && features.include?('Map Imagery')
    params = params.merge('provider' => providers) if use_gibs
    params = params.merge('short_name' => short_names) if use_gibs

    nrt = features && features.include?('Near Real Time')
    params = params.merge('collection_data_type' => 'NEAR_REAL_TIME') if nrt

    if params["two_d_coordinate_system"]
      old = params.delete("two_d_coordinate_system")
      params["two_d_coordinate_system_name"] = old["name"]
    end

    params['hierarchical_facets'] = 'true' if params['include_facets'] == 'true' && hierarchical

    params
  end

  def parse_hierarchical_keywords(facets, parent, params)
    facets = [facets] if facets.is_a? Hash
    KEYWORD_CHILD.keys.each do |key|
      if key == parent
        if params[key]
          if params[key] == '--ALL--'
            # add all, don't trim
            items = []
            facets.each do |facet|
              items << [facet['value'], facet['count']]
            end
            rtn = {:value => {'field' => key, 'value-counts' => items}, :facet_tree => facets}
            return rtn
          else
            # for every facet in this level
            facets.each do |facet|
              if facet['value'] == URI.unescape(params[key])
                # find the right one and trim facets tree
                tmp1 = {'field' => key, 'value-counts' => [[facet['value'], facet['count']]]}
                tmp2 =  (facet.is_a? Hash) && !facet['subfields'].nil? ? facet[facet['subfields'][0]] : nil
                rtn = {:value => tmp1, :facet_tree => tmp2}
                return rtn
              end
            end
          end
        else
          # this is not gonna happen if the facets tree is trimmed correctly
          return {:value => {'field' => key, 'value-counts' => []}, :facet_tree => facets}
        end
      end
    end
  end

end
