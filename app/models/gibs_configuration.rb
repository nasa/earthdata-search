class GibsConfiguration
  WV_CONFIG_URL="https://worldview.earthdata.nasa.gov/config/wv.json"

  def initialize(url=WV_CONFIG_URL)
    @url = url
  end

  def sync_tags!(tag_key, client, token)
    configs = load_configs(@url)
    return false if configs.nil?

    all_conditions = []
    configs.each do |config|
      response = client.add_tag(tag_key, config[:config], config[:collections], token, true, false) do |tag|
        tag['product'] || tag[:product]
      end
      unless response.success?
        puts "[#{Time.now}] add_tag failed with status: #{response.status}, error: #{response.body.to_json}"
        raise "[#{Time.now}] add_tag failed with status: #{response.status}, error: #{response.body.to_json}"
      end
      all_conditions << config[:collections]['condition']
    end
    # TODO: Update cleanup logic to use https://bugs.earthdata.nasa.gov/browse/CMR-2609
    #       when available
    tag_removal_condition = {
      'condition' => {'and' => [
                        {'tag' => {'tag_key' => tag_key}},
                        {'not' => {'or' => all_conditions}}]}
    }
    response = client.remove_tag(tag_key, tag_removal_condition, token)
    unless response.success?
      puts "[#{Time.now}] remove_tag failed with status: #{response.status}, error: #{response.body.to_json}"
      raise "[#{Time.now}] remove_tag failed with status: #{response.status}, error: #{response.body.to_json}"
    end
    true
  end

  private

  def build_connection
    Faraday.new do |conn|
      conn.response :json, :content_type => /\bjson$/
      conn.adapter(Faraday.default_adapter)
    end
  end

  def load_configs(url)
    response = build_connection.get(url)
    return nil unless response.success?

    wv_json = response.body

    config_file = File.read(Rails.root.join('config', 'gibs.json'))
    config_json = JSON.parse(config_file)

    json = {}
    wv_json.each do |k, v|
      json[k] = v.merge(config_json[k]) if config_json[k]
    end

    layers = json['layers']
    products = json['products']

    layers.each do |key, layer|
      layer['product'] = products[layer['product']]

      layer['projections'] ||= {}
      layer['projections'].delete_if do |key, value|
        !['GIBS:antarctic', 'GIBS:arctic', 'GIBS:geographic'].include?(value['source'])
      end
    end

    layers.reject! do |key, layer|
      layer['projections'].size == 0 || layer['type'] != 'wmts' || layer['product'].nil?
    end

    configs = []

    layers.each do |key, layer|
      config = {}
      match = {}
      product = layer['product']
      query = product['query']

      match['time_start'] = ">=#{layer['startDate']}" if layer['startDate']
      match['time_end'] = "<=#{layer['endDate']}" if layer['endDate']

      match['day_night_flag'] = query['dayNightFlag'] if query['dayNightFlag']

      geo_resolution = layer['projections']['geographic']['matrixSet'].split('_').last if layer['projections']['geographic']
      arctic_resolution = layer['projections']['arctic']['matrixSet'].split('_').last if layer['projections']['arctic']
      antarctic_resolution = layer['projections']['antarctic']['matrixSet'].split('_').last if layer['projections']['antarctic']

      config = {
        match: match,
        product: layer['id'],
        maxNativeZoom: 5,
        title: layer['title'],
        source: layer['subtitle'],
        format: layer['format'].split('/').last,
        resolution: layer['projections'].first.last['matrixSet'].split('_').last,
        geo: layer['projections'].key?('geographic'),
        arctic: layer['projections'].key?('arctic'),
        antarctic: layer['projections'].key?('antarctic'),
        geo_resolution: geo_resolution,
        arctic_resolution: arctic_resolution,
        antarctic_resolution: antarctic_resolution
      }

      datacenter = Array.wrap(query['dataCenterId'])
      shortname = Array.wrap(query['shortName'])

      if query.key?('science') || query.key?('nrt')
        query.values do |sub_query|
          configs << {
            collections: query_to_cmr(sub_query),
            config: config
          }
        end
      else
        configs << {
          collections: query_to_cmr(query),
          config: config
        }
      end
    end

    configs
  end

  def query_to_cmr(query)
    mappings = {
      'conceptId' => ->(value) { {'concept_id' => value} },
      'dataCenterId' => ->(value) { {'provider' => value} },
      'shortName' => ->(value) { {'short_name' => value} }
    }
    top_level = []
    query.find_all {|k, v| mappings.key?(k)}.each do |k, values|
      conditions = Array.wrap(values).map(&mappings[k])
      if conditions.size > 1
        top_level << {'or' => conditions}
      else
        top_level << conditions.first
      end
    end
    result = nil
    if top_level.size > 1
      result = {'and' => top_level}
    else
      result = top_level.first
    end
    {"condition" => result}
  end
end
