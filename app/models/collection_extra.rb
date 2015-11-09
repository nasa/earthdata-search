class CollectionExtra < ActiveRecord::Base
  validates_presence_of :echo_id
  validates_uniqueness_of :echo_id

  store :searchable_attributes, coder: JSON
  store :orbit, coder: JSON

  def self.build_echo_client(env=(@echo_env || Rails.configuration.echo_env))
    Echo::Client.client_for_environment(env, Rails.configuration.services)
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
      extra = CollectionExtra.find_or_create_by(echo_id: collection['echo_collection_id'])
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
          puts "#{collection['id'].inspect} => #{opts.inspect},"
        end
      end
    end

    nil
  end

  def self.each_collection(echo_client, extra_params={})
    params = {page_num: 0, page_size: 2000}
    processed_count = 0

    begin
      params[:page_num] += 1
      response = echo_client.get_collections(params.merge(extra_params))
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
        puts "#{processed_count} / #{hits} Collections Processed"
      end
    end while processed_count < hits && collections.size > 0

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
    ['C1000000016-LANCEMODIS', 'C1000000019-LANCEMODIS']
  end

  def decorate(collection)
    collection = collection.dup.with_indifferent_access

    decorate_browseable_granule(collection)
    decorate_granule_information(collection)
    decorate_gibs_layers(collection)
    decorate_opendap_layers(collection)
    decorate_echo10_attributes(collection)
    decorate_modaps_layers(collection)

    collection[:links] = Array.wrap(collection[:links]) # Ensure links attribute is present

    collection
  end

  def clean_attributes
    @clean_attrs ||= Array.wrap((searchable_attributes || {})['attributes']).map do |attr|
      attr = attr.dup
      # Delete useless garbage
      name = attr['name']
      description = attr['description']
      if description == 'None' ||
          description == name ||
          description.start_with?("The #{name} for this collection") ||
          description.start_with?("The #{name} attribute for this granule")

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

  def decorate_gibs_layers(collection)
    key = [collection['data_center'], collection['short_name']].join('___')
    gibs_config = Rails.configuration.gibs[key]
    collection[:gibs] = gibs_config unless gibs_config.nil?
  end

  def decorate_opendap_layers(collection)
    collection[:opendap] = false
    opendap_config = Rails.configuration.services['opendap'][collection['id']]
    if opendap_config.present?
      collection[:opendap] = opendap_config['granule_url_template'].split('{').first
    end
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
