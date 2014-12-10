class DatasetExtra < ActiveRecord::Base
  validates_presence_of :echo_id
  validates_uniqueness_of :echo_id

  store :searchable_attributes, coder: JSON
  store :orbit, coder: JSON

  def self.build_echo_client(env=(@echo_env || Rails.configuration.echo_env))
    Echo::Client.client_for_environment(env, Rails.configuration.services, @enable_cmr)
  end

  def self.load
    echo_client = build_echo_client

    response = echo_client.get_provider_holdings
    results = response.body
    hits = response.headers['echo-dataset-hits'].to_i

    processed_count = 0

    results.each do |result|
      id = result['echo_collection_id']
      extra = DatasetExtra.find_or_create_by(echo_id: id)

      extra.has_granules = result["granule_count"].to_i > 0
      extra.has_browseable_granules = false unless extra.has_granules

      if extra.has_granules
        if extra.has_browseable_granules.nil? || (extra.has_browseable_granules && extra.browseable_granule.nil?)
          browseable = echo_client.get_granules(format: 'json',
                                                 echo_collection_id: [id],
                                                 page_size: 1, browse_only: true).body['feed']['entry']
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
    each_dataset(build_echo_client, format: 'echo10') do |dataset|
      extra = DatasetExtra.find_or_create_by(echo_id: dataset['echo_dataset_id'])
      dataset = dataset['Collection']

      # Additional attribute definitions
      attribute_defs = dataset['AdditionalAttributes'] || {}
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
      spatial = dataset['Spatial'] || {}
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

    each_dataset(echo_client) do |dataset|
      # Skip datasets that we've seen before which have no browseable granules.  Saves tons of time
      granules = echo_client.get_granules(format: 'json', echo_collection_id: [dataset['id']], page_size: 1).body

      granule = granules['feed']['entry'].first
      if granule
        order_info = echo_client.get_order_information([granule['id']], nil).body
        refs = Array.wrap(order_info).first['order_information']['option_definition_refs']
        if refs
          opts = refs.map {|r| [r['id'], r['name']]}
          puts "#{dataset['id'].inspect} => #{opts.inspect},"
        end
      end
    end

    nil
  end

  def self.each_dataset(echo_client, extra_params={})
    params = {page_num: 0, page_size: 2000}
    processed_count = 0

    begin
      params[:page_num] += 1
      response = echo_client.get_datasets(params.merge(extra_params))
      body = response.body
      if body['results']
        # ECHO10
        datasets = Array.wrap(body['results']['result'])
      elsif body['feed']
        # Atom
        datasets = body['feed']['entry']
      else
        datasets = []
      end

      if response.headers['echo-hits']
        hits = response.headers['echo-hits'].to_i
      else
        hits = response.headers['cmr-hits'].to_i
      end

      datasets.each do |dataset|
        yield dataset
        processed_count += 1
        puts "#{processed_count} / #{hits} Datasets Processed"
      end
    end while processed_count < hits && datasets.size > 0

    nil
  end

  def self.decorate_all(datasets)
    ids = datasets.map {|r| r['id']}
    extras = DatasetExtra.where(echo_id: ids).index_by(&:echo_id)

    datasets.map! do |result|
      extra = extras[result['id']] || DatasetExtra.new
      extra.decorate(result)
    end
  end

  def self.featured_ids
    ['C1000000016-LANCEMODIS', 'C1000000019-LANCEMODIS']
  end

  def decorate(dataset)
    dataset = dataset.dup.with_indifferent_access

    decorate_browseable_granule(dataset)
    decorate_granule_information(dataset)
    decorate_gibs_layers(dataset)
    decorate_opendap_layers(dataset)
    decorate_echo10_attributes(dataset)
    decorate_modaps_layers(dataset)

    dataset[:links] = Array.wrap(dataset[:links]) # Ensure links attribute is present

    dataset
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

  def decorate_echo10_attributes(dataset)
    dataset[:searchable_attributes] = self.clean_attributes
    dataset[:orbit] = self.orbit if self.orbit.present?
  end

  def decorate_browseable_granule(dataset)
    dataset[:browseable_granule] = self.browseable_granule
  end

  def decorate_granule_information(dataset)
    dataset[:has_granules] = self.has_granules unless dataset.key?(:has_granules)
  end

  def decorate_gibs_layers(dataset)
    key = [dataset['data_center'], dataset['short_name']].join('___')
    gibs_config = Rails.configuration.gibs[key]
    dataset[:gibs] = gibs_config unless gibs_config.nil?
  end

  def decorate_opendap_layers(dataset)
    dataset[:opendap] = false
    opendap_config = Rails.configuration.services['opendap'][dataset['id']]
    if opendap_config.present?
      dataset[:opendap] = opendap_config['granule_url_template'].split('{').first
    end
  end

  def decorate_modaps_layers(dataset)
    dataset[:modaps] = false
    modaps_config = Rails.configuration.services['modaps'][dataset['id']]
    if modaps_config.present?
      dataset[:modaps] = Hash.new
      dataset[:modaps][:get_capabilities] =  "http://modwebsrv.modaps.eosdis.nasa.gov/wcs/5/#{dataset[:short_name]}/getCapabilities?service=WCS&version=1.0.0&request=GetCapabilities"
      # TODO: "coverage=250m Surface Reflectance Band 1:Day" doesn't work for all datasets
      # Also, I'm not sure about the other params needed for DescribeCoverage and GetCoverage
      dataset[:modaps][:describe_coverage] =  "http://modwebsrv.modaps.eosdis.nasa.gov/wcs/5/#{dataset[:short_name]}/describeCoverage?service=WCS&version=1.0.0&request=DescribeCoverage&coverage=250m Surface Reflectance Band 1:Day"
      dataset[:modaps][:get_coverage] =  "http://modwebsrv.modaps.eosdis.nasa.gov/wcs/5/#{dataset[:short_name]}/getCoverage?service=WCS&version=1.0.0&request=GetCoverage&coverage=250m Surface Reflectance Band 1:Day&bbox=(spatial)&time=(temporal)&format=geotiff&response_crs=EPSG:4326&resx=0.01&resy=0.01"
    end
  end

end
