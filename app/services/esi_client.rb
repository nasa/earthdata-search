class ESIClient
  Faraday.register_middleware(:response, :logging => Echo::ClientMiddleware::LoggingMiddleware)

  def self.submit_esi_request(dataset_id, params, method, client, token)
    option_definition_id = method['id']

    service_option_assignment = client.get_service_order_information(dataset_id, token).body

    service_entry_id = service_option_assignment[0]['service_option_assignment']['service_entry_id']

    service_url = client.get_service_entry(service_entry_id, token).body['service_entry']['url']

    # FILE_IDS is a comma seperated list of granule_ur's
    granules = client.get_granules(params, token).body['feed']['entry'].map{|g| g['title']}

    options = {}

    options['FILE_IDS'] = granules.join(',')

    @model = Nokogiri::XML(method['model'].strip)

    params_hash = build_params
    options.merge!(params_hash)

    puts "PARAMS: #{options.inspect}"

    response = connection.post(service_url, options)
    puts "RESPONSE: #{response.inspect}"
    response
  end

  def self.connection
    Thread.current[:esi_connection] || self.build_connection
  end

  private

  def self.post(url, params={})
    connection.post(url, params)
  end

  def self.build_connection
    Faraday.new do |conn|
      conn.request :url_encoded
      conn.response :logging
      conn.response :json, :content_type => /\bjson$/
      conn.adapter Faraday.default_adapter
    end
  end

  def self.esi_fields
    @esi_fields ||= {}
  end

  def self.build_params
    add_top_level_fields

    add_switch_field(:INCLUDE_META)

    add_name_value_pairs_for_projections(:PROJECTION_PARAMETERS)
    add_name_value_pairs_for_resample(:RESAMPLE)

    add_subset_data_layers
    add_bounding_box

    add_parameter(:EMAIL, find_field_element("email").text.strip)

    esi_fields
  end

  def self.add_parameter(field_symbol, value)
    # send "#{field_symbol}=", value if !value.blank?
    esi_fields[field_symbol.to_s] = value if !value.blank?
  end

  def self.find_field_element(field_symbol, data_type = 'ecs')
    find_by_xpath("//#{data_type}:#{field_symbol.to_s}|//zed")
  end

  def self.find_by_xpath(xpath)
    @model.xpath(xpath,
        'xmlns' => 'http://echo.nasa.gov/v9/echoforms',
        #'eesi' => "http://eosdis.nasa.gov/esi/req/e",
        'ecs' => "http://ecs.nasa.gov/options",
        'info' => "http://eosdis.nasa.gov/esi/info")
  end

  def self.add_top_level_fields
    [
        :INTERPOLATION,
        :FORMAT,
        :PROJECTION,
        :CLIENT,
        :START,
        :END,
        :NATIVE_PROJECTION,
        :OUTPUT_GRID,
        :BBOX,
        :SUBAGENT_ID,
        :REQUEST_MODE,
        :META,
        :INCLUDE_META,
  ].each do |field|
      add_parameter(field, find_field_element(field).text.strip)
    end
  end

  TRANSLATE= {
      'true' => 'Y',
      'True' => 'Y',
      'TRUE' => 'Y',
      'y' => 'Y',
      'Y' => 'Y',
      'false' => 'N',
      'False' => 'N',
      'FALSE' => 'N',
      'n' => 'N',
      'N' => 'N'
  }

  def self.add_switch_field(field_symbol)
    add_parameter(field_symbol, TRANSLATE[find_field_element(field_symbol).text.strip]  )
  end

  def self.add_name_value_pairs_for_projections(field_symbol)
    field_element = find_field_element(field_symbol)
    projections = compact_nodes(field_element)
    items = projections.map do |projection|
      compact_nodes(projection.children).map do |project_parameter_lists|
        compact_nodes(project_parameter_lists.children).map do |project_parameter_field|
          "#{project_parameter_field.name}:#{project_parameter_field.text}" if project_parameter_field.text.present?
        end
      end
    end.flatten.compact.map(&:chomp).join(",")

    add_parameter(field_symbol, items)
  end

  def self.add_name_value_pairs_for_resample(field_symbol)
    sub_field_values = find_field_element(field_symbol).children
    add_parameter(field_symbol, build_resample_pairs(sub_field_values))
  end

  def self.build_resample_pairs(sub_field_values)
    sub_fields = Hash[compact_nodes(sub_field_values).map do |nd|
      [nd.name, nd.text && nd.text.strip]
    end]

    value = sub_fields.keys.select {|x| x.include?('value')}.first
    if value.present?
      key = sub_fields.keys.select {|x| x.include?('dimension')}.first
      "#{sub_fields[key]}:#{sub_fields[value]}"
    end
  end

  def self.add_subset_data_layers
    data_layers = collect_subset_data_layers

    add_parameter(:SUBSET_DATA_LAYERS, data_layers)
  end

  def self.collect_subset_data_layers
    find_subset_banding.join(',')
  end

  def self.find_subset_banding()
    objects = find_by_xpath(
        "//ecs:SUBSET_DATA_LAYERS/*[ecs:subtreeSelected='true' and ecs:subtreeSelected='true']/@value"
    ).to_a

    fields = find_by_xpath(
        "//ecs:SUBSET_DATA_LAYERS/descendant::*[ecs:itemSelected='true' and ecs:subtreeSelected='true']/@value"
    ).to_a

    bands= find_by_xpath(
        "//ecs:SUBSET_DATA_LAYERS/descendant::*[ecs:itemSelected ='true']/*[ecs:value > 0]"
    ).map do |a_node|
      value_text = a_node['value']
      ecs_value = a_node.xpath('ecs:value')
      "#{value_text}[#{ecs_value.text}]"
    end

    tree_style_bands = find_by_xpath("//ecs:SUBSET_DATA_LAYERS[@style='tree']/descendant::*/text()")

    objects + fields + bands + tree_style_bands
  end

  def self.add_bounding_box
    bbox = {}
    find_field_element("boundingbox").children.each do |item|
      text = item.text.strip
      bbox[item.name] = item.text.strip if item && !item.blank? && text.present?
    end

    if bbox.size == 4
      add_parameter(:BBOX, %w{ullon lrlat lrlon ullat}.
          map { |an_edge| bbox[an_edge] }.
          join(','))
    end
  end

  def self.compact_nodes(node_set)
    node_set.select { |sub_field_value| !sub_field_value.blank? }
  end

end
