class CollectionExtra < ActiveRecord::Base

  self.table_name = "dataset_extras"

  validates_presence_of :echo_id
  validates_uniqueness_of :echo_id

  store :searchable_attributes, coder: JSON
  store :orbit, coder: JSON

  def self.build_echo_client(env=(@cmr_env || Rails.configuration.cmr_env))
    Echo::Client.client_for_environment(env, Rails.configuration.services)
  end

  def self.create_system_token(client)
    response = client.create_token(ENV['system_user'], ENV['system_user_password'])
    if response.success? && response.body['token']
      response.body['token']['id']
    else
      nil
    end
  end

  def self.sync_opendap(client, token, collection)
    config = OpendapConfiguration.find(collection, client, token)
    # TODO: Once CMR supports it, we want the subset_service to be a string data value
    if config.has_opendap_subsetting?
      add_extra_tag(collection, 'subset_service.opendap', nil, client, token)
    elsif !config.has_opendap_subsetting?
      remove_extra_tag(collection, 'subset_service.opendap', nil, client, token)
    end
  end

  def self.sync_esi(client, token)
    option_response = client.get_all_service_order_information(token)

    if option_response.success?
      ids = option_response.body.map {|option| option['service_option_assignment']['catalog_item_id']}

      each_collection(client, {tag_key: tag_key('subset_service.esi')}, token) do |collection|
        # Remove tags which are no longer applicable
        unless ids.include?(collection['id'])
          remove_extra_tag(collection, 'subset_service.esi', nil, client, token)
        end
        # Ensure all the ids need the tag
        ids.delete(collection['id'])
      end

      if ids.present?
        key = tag_key('subset_service.esi')
        client.add_tag(key, nil, ids, token)
      end
    end
    nil
  end

  def self.sync_gibs(client, token)
    GibsConfiguration.new.sync_tags!(tag_key('gibs'), client, token)
  end

  def self.sync_tags
    client = build_echo_client
    token = create_system_token(client)
    tags = [
      'subset_service.opendap',
      'subset_service.esi',
      'gibs'
    ]

    # Remove stale tags
    stale_tags = {}
    tags.each do |tag|
      stale_tags[tag] = []
      client.create_tag_if_needed(tag_key(tag), token)
    end

    each_collection(client, {has_granules: false, tag_key: tag_key('*')}, token) do |collection|
      stale_tags.each do |tag, collections|
        collections << collection['id'] if has_tag(collection, tag)
      end
    end
    stale_tags.each do |tag, collections|
      client.remove_tag(tag, collections, token) if collections.present?
    end

    each_collection(client, {has_granules: true}, token) do |collection|
      sync_opendap(client, token, collection)
    end

    sync_esi(client, token)
    sync_gibs(client, token)
  end

  def self.add_extra_tag(collection, key, value, client, token)
    key = tag_key(key)
    client.add_tag(key, value, collection['id'], token) unless has_tag(collection, key, value)
  end

  def self.remove_extra_tag(collection, key, value, client, token)
    key = tag_key(key)
    client.remove_tag(key, collection['id'], token) if has_tag(collection, key, value)
  end

  def self.tag_key(tag)
    ns = Rails.configuration.cmr_tag_namespace
    namespaced = ['org.', 'gov.', ns].any? {|prefix| tag.start_with?(prefix)}
    namespaced ? tag : [ns, tag].join('.extra.')
  end

  def self.tag_value(collection, tag)
    tag = tag_key(tag)
    tags = collection['tags']
    result = nil
    if tags.is_a?(Hash)
      result = tags[tag] && tags[tag]['data']
    elsif tags.is_a?(Array)
      tagdot = "#{tag}."
      match = tags.find {|t| t.start_with?(tagdot)}
      result = match.gsub(/^#{tagdot}/, '') if match.present?
      result = true if !result.present? && tags.include?(tag)
    end
    result
  end

  def self.has_tag(collection, tag, value=nil)
    tag = tag_key(tag)
    tags = collection['tags']
    actual = tag_value(collection, tag)
    if tags.is_a?(Array) || !value.nil?
      (value.nil? && actual != nil) || (!value.nil? && actual == value)
    else
      !tags.nil? && !tags[tag].nil?
    end
  end

  def self.load
    echo_client = build_echo_client

    response = echo_client.get_provider_holdings
    results = response.body
    hits = response.headers['echo-collection-hits'].to_i

    processed_count = 0

    results.each do |result|
      id = result['echo_collection_id']
      extra = CollectionExtra.find_or_create_by(echo_id: id)

      extra.has_granules = result["granule_count"].to_i > 0
      extra.has_browseable_granules = false unless extra.has_granules

      if extra.has_granules
        # Edited the condition to update browseable_granule ID if it hasn't been updated for a week.
        if extra.has_browseable_granules.nil? || (extra.has_browseable_granules && extra.updated_at < 1.week.ago)
          browseable = echo_client.get_granules(format: 'json',
                                                 echo_collection_id: [id],
                                                 page_size: 1, browse_only: true, sort_key: ['-start_date']).body['feed']['entry']
          extra.has_browseable_granules = browseable.size > 0
          if extra.has_browseable_granules
            extra.granule = extra.browseable_granule = browseable.first['id']
          end
        end
        if extra.granule.nil?
          granules = echo_client.get_granules(format: 'json',
                                               echo_collection_id: [id],
                                               page_size: 1).body['feed']['entry']

          extra.granule = granules.first['id'] if granules.first
        end
        puts "Provider has granules but no granules found: #{result['echo_collection_id']}" unless extra.granule
      end

      extra.save if extra.changed?

      processed_count += 1

      puts "#{processed_count} / #{hits}"
    end
  end

  def self.load_echo10
    each_collection(build_echo_client, format: 'echo10') do |collection|
      extra = CollectionExtra.find_or_create_by(echo_id: collection['concept_id'])
      collection = collection['Collection']

      # Additional attribute definitions
      attribute_defs = collection['AdditionalAttributes'] || {}
      attributes = Array.wrap(attribute_defs['AdditionalAttribute']).reject {|a| a['Value']}
      if attributes.present?
        attributes = attributes.map do |attr|
          attr.map { |k, v| {k.underscore => v} }.reduce(&:merge)
        end
        extra.searchable_attributes = {attributes: attributes}
      else
        extra.searchable_attributes = {attributes: []}
      end

      # Orbit parameters
      spatial = collection['Spatial'] || {}
      orbit = spatial['OrbitParameters']
      if orbit
        orbit = orbit.map { |k, v| {k.underscore => v} }.reduce(&:merge)
        extra.orbit = orbit
      else
        extra.orbit = {}
      end

      extra.save if extra.changed?
    end

    nil
  end

  def self.load_option_defs
    echo_client = build_echo_client

    each_collection(echo_client) do |collection|
      # Skip collections that we've seen before which have no browseable granules.  Saves tons of time
      granules = echo_client.get_granules(format: 'json', echo_collection_id: [collection['id']], page_size: 1).body

      granule = granules['feed']['entry'].first
      if granule
        order_info = echo_client.get_order_information([granule['id']], nil).body
        refs = Array.wrap(order_info).first['order_information']['option_definition_refs']
        if refs
          opts = refs.map {|r| [r['id'], r['name']]}
        end
      end
    end

    nil
  end

  def self.each_collection(echo_client, extra_params={}, token=nil)
    params = {page_num: 0, page_size: 2000}
    processed_count = 0

    start = Time.now
    begin
      params[:page_num] += 1
      response = echo_client.get_collections(params.merge(extra_params), token)
      body = response.body
      if body['results']
        # ECHO10
        collections = Array.wrap(body['results']['result'])
      elsif body['feed']
        # Atom
        collections = body['feed']['entry']
      else
        collections = []
      end

      hits = response.headers['cmr-hits'].to_i

      collections.each do |collection|
        yield collection
        processed_count += 1
      end
      puts "#{processed_count} / #{hits} Collections Processed"
    end while processed_count < hits && collections.size > 0
    puts "#{processed_count} Collections Processed in #{Time.now - start}s"

    nil
  end

  def self.decorate_all(collections)
    ids = collections.map {|r| r['id']}
    extras = CollectionExtra.where(echo_id: ids).index_by(&:echo_id)

    collections.map! do |result|
      extra = extras[result['id']] || CollectionExtra.new
      extra.decorate(result)
    end
  end

  def self.featured_ids
    ['C1229626387-LANCEMODIS', 'C1219032686-LANCEMODIS']
  end

  def decorate(collection)
    collection = collection.dup.with_indifferent_access

    decorate_browseable_granule(collection)
    decorate_granule_information(collection)
    decorate_opendap_layers(collection)
    decorate_echo10_attributes(collection)
    decorate_modaps_layers(collection)
    decorate_tag_mappings(collection)
    decorate_gibs_granule_example(collection)

    collection[:links] = Array.wrap(collection[:links]) # Ensure links attribute is present

    collection
  end

  def clean_attributes
    @clean_attrs ||= Array.wrap((searchable_attributes || {})['attributes']).map do |attr|
      attr = attr.dup
      # Delete useless garbage
      name = attr['name']
      description = attr['description']
      if description.present? &&
          (description == 'None' ||
          description == name ||
          description.start_with?("The #{name} for this collection") ||
          description.start_with?("The #{name} attribute for this granule"))

        attr.delete('description')
      end

      attr['data_type'] = 'STRING' if attr['data_type'].include?('STRING')

      renames = {
        'data_type' => 'type',
        'parameter_units_of_measure' => 'unit',
        'parameter_range_begin' => 'begin',
        'parameter_range_end' => 'end'
      }

      renames.each do |from, to|
        value = attr.delete(from)
        attr[to] = value if value
      end

      type_to_name = {
        'INT' => 'Integer',
        'FLOAT' => 'Float',
        'DATETIME' => 'Date/Time',
        'TIME' => 'Time',
        'DATE' => 'Date',
        'STRING' => 'String value'
      }

      help = type_to_name[attr['type']] || attr['type']
      help += " #{attr['unit']}" if attr['unit']

      if attr['begin'] && attr['end']
        help += " from #{attr['begin']} to #{attr['end']}"
      elsif attr['begin']
        help += ", minimum: #{attr['begin']}"
      elsif attr['end']
        help += ", maximum: #{attr['end']}"
      end
      help += ", ranges allowed" unless attr['type'] == 'STRING'
      attr['help'] = help

      if ['INT', 'FLOAT'].include?(attr['type'])
        attr['begin'] = attr['begin'].to_f if attr['begin']
        attr['end'] = attr['end'].to_f if attr['end']
      end

      attr
    end
    @clean_attrs.presence
  end

  private

  # Example single granule imagery from GIBS UAT for AST_L1T
  def decorate_gibs_granule_example(collection)
    if collection['short_name'] == 'AST_L1T'
      collection[:tags] ||= {}
      # Example URL:
      # http://uat.gibs.earthdata.nasa.gov/wmts/epsg4326/std/ASTER_L1T_Radiance_Terrain_Corrected_v3_STD/default/2016-02-17T17:45:56Z/31.25m/7/27/33.png
      # Template: http://uat.gibs.earthdata.nasa.gov/wmts/{projection}/std/{product}/default/{time_start}/{resolution}/{z}/{y}/{x}.{format}
      collection[:tags]['edsc.extra.gibs'] = {
        data: [
          {
            granule: true, # Turns on granule browse behavior
            match: { # Matches the small subset of granules which work
              time_start: '>=2016-02-17T17:44:27Z',
              time_end: '<=2016-02-17T17:45:56Z'
            },
            projection: 'epsg4326',
            product: 'ASTER_L1T_Radiance_Terrain_Corrected_v3_STD',
            resolution: '31.25m',
            format: 'png',
            maxNativeZoom: 11,
            title: "ASTER L1T Full-Resolution Browse",
            source: "NASA EOSDIS",
            geo: true,
            arctic: false,
            antarctic: false
          }
        ]
      }
    end
  end

  def decorate_tag_mappings(collection)
    ns = Rails.configuration.cmr_tag_namespace

    if self.class.has_tag(collection, 'org.ceos.wgiss.cwic.granules.prod') && !collection[:has_granules]
      ds_tag = "#{ns}.datasource"
      renderers_tag = "#{ns}.renderers"
      collection[:tags][ds_tag] = {data: 'cwic'} unless self.class.has_tag(collection, ds_tag)
      collection[:tags][renderers_tag] = {data: ['cwic']} unless self.class.has_tag(collection, renderers_tag)
    end
  end

  def decorate_echo10_attributes(collection)
    collection[:searchable_attributes] = self.clean_attributes
    collection[:orbit] = self.orbit if self.orbit.present?
  end

  def decorate_browseable_granule(collection)
    collection[:browseable_granule] = self.browseable_granule
  end

  def decorate_granule_information(collection)
    collection[:has_granules] = self.has_granules unless collection.key?(:has_granules)
  end

  def decorate_opendap_layers(collection)
    # Note: this is now decoupled from the tag. Collections can have opendap endpoints
    # in their metadata surfaced this way without getting the badge
    # TODO: Once we can remove the legacy config, this can be done in Javascript
    collection[:opendap_url] = OpendapConfiguration.opendap_root(collection)
    collection[:opendap] = self.class.has_tag(collection, 'subset_service.opendap') || self.class.has_tag(collection, 'subset_service.esi')
  end

  def decorate_modaps_layers(collection)
    collection[:modaps] = false
    modaps_config = Rails.configuration.services['modaps'][collection['id']]
    if modaps_config.present?
      collection[:modaps] = Hash.new
      collection[:modaps][:get_capabilities] =  "http://modwebsrv.modaps.eosdis.nasa.gov/wcs/5/#{collection[:short_name]}/getCapabilities?service=WCS&version=1.0.0&request=GetCapabilities"
    end
  end

end
