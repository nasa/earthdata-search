class DatasetExtra < ActiveRecord::Base
  GIBS_CONFIGURATIONS = {
    'C1000000016-LANCEMODIS' => {
      product: 'MODIS_Terra_Snow_Cover',
      format: 'png',
      resolution: '500m'
    },
    'C1000000019-LANCEMODIS' => {
      product: 'MODIS_Terra_Aerosol',
      maxNativeZoom: 5,
      format: 'png',
      resolution: '2km',
      arctic: false,
      antarctic: false
    }
  }

  validates_presence_of :echo_id
  validates_uniqueness_of :echo_id

  store :searchable_attributes, coder: JSON
  store :orbit, coder: JSON


  def self.load
    response = Echo::Client.get_provider_holdings
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
          browseable = Echo::Client.get_granules(format: 'json',
                                                 echo_collection_id: [id],
                                                 page_size: 1, browse_only: true).body['feed']['entry']
          extra.has_browseable_granules = browseable.size > 0
          if extra.has_browseable_granules
            extra.granule = extra.browseable_granule = browseable.first['id']
          end
        end
        if extra.granule.nil?
          granules = Echo::Client.get_granules(format: 'json',
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
    params = {page_num: 0, page_size: 500}
    processed_count = 0

    begin
      params[:page_num] += 1
      response = Echo::Client.get_datasets(params.merge(format: 'echo10'))
      datasets = Array.wrap(response.body['results']['result'])
      hits = response.headers['echo-hits'].to_i

      datasets.each do |dataset|
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

        processed_count += 1
      end
    end while processed_count < hits && datasets.size > 0

    nil
  end

  def self.load_option_defs
    params = {page_num: 0, page_size: 20}
    processed_count = 0

    begin
      params[:page_num] += 1
      response = Echo::Client.get_datasets(params)
      datasets = response.body
      hits = response.headers['echo-hits'].to_i

      datasets['feed']['entry'].each do |dataset|
        # Skip datasets that we've seen before which have no browseable granules.  Saves tons of time
        granules = Echo::Client.get_granules(format: 'json', echo_collection_id: [dataset['id']], page_size: 1).body

        granule = granules['feed']['entry'].first
        if granule
          order_info = Echo::Client.get_order_information([granule['id']], nil).body
          refs = Array.wrap(order_info).first['order_information']['option_definition_refs']
          if refs
            opts = refs.map {|r| [r['id'], r['name']]}
            puts "#{dataset['id'].inspect} => #{opts.inspect},"
          end
        end

        processed_count += 1

        #puts "#{processed_count} / #{hits}"
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
    GIBS_CONFIGURATIONS.keys
  end

  def decorate(dataset)
    dataset = dataset.dup.with_indifferent_access

    decorate_browseable_granule(dataset)
    decorate_granule_information(dataset)
    decorate_gibs_layers(dataset)
    decorate_echo10_attributes(dataset)

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
    dataset[:has_granules] = self.has_granules
  end

  def decorate_gibs_layers(dataset)
    gibs_config = GIBS_CONFIGURATIONS[dataset[:id]]
    dataset[:gibs] = gibs_config unless gibs_config.nil?
  end
end
