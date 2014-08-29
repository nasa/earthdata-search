require 'addressable/template'

class OpendapConfiguration

  def self.find(dataset_id)
    opendap_config = Rails.configuration.services['opendap'][dataset_id]
    return OpendapConfiguration.new() unless opendap_config.present?
    ddx = Faraday.get(opendap_config['ddx_url']).body

    parsed = MultiXml.parse(ddx)

    parsed_attribute_arrays = parsed["Dataset"] && parsed["Dataset"]["Array"]
    return OpendapConfiguration.new() unless parsed_attribute_arrays.present?

    title_attribute = opendap_config['title_attribute']
    units_attribute = opendap_config['units_attribute']
    nounits_value = opendap_config['nounits_value']
    latitude_dim_name = opendap_config['latitude_dim_name']
    longitude_dim_name = opendap_config['longitude_dim_name']

    all_dimensions = Set.new
    parameters = []
    dimension_parameters = []
    Array.wrap(parsed_attribute_arrays).each do |array|
      parameter = {id: array['name'], title: ''}
      title = nil
      units = nil
      lat_dim_size = nil
      lng_dim_size = nil

      Array.wrap(array['Attribute']).each do |attribute|
        name = attribute['name']
        if name == title_attribute
          parameter[:title] = attribute['value']
        elsif name == units_attribute
          value = attribute['value']
          value = nil if value == nounits_value
          parameter[:units] = value
        end
      end

      dimensions = []
      Array.wrap(array['dimension']).each do |dimension|
        name = dimension['name']
        size = dimension['size'].to_i
        dimensions << {name: name, size: size}
        all_dimensions << name
      end
      parameter[:dimensions] = dimensions
      if all_dimensions.include? parameter[:id]
        dimension_parameters << parameter
      else
        parameters << parameter
      end
    end

    OpendapConfiguration.new(
      template: opendap_config['granule_url_template'],
      formats: [{name: 'Original (No Subsetting)', ext: '', canSubset: false},
                {name: 'NetCDF', ext: '.nc', canSubset: true},
                {name: 'ASCII', ext: '.ascii', canSubset: true}],
      parameters: parameters,
      dimension_parameters: dimension_parameters,
      latitude_dim_name: latitude_dim_name,
      longitude_dim_name: longitude_dim_name
    )
  end

  attr_reader :parameters, :formats

  def initialize(options={})
    @template = Addressable::Template.new(options[:template]) if options[:template]
    @formats = Array.wrap(options[:formats])
    @parameters = Array.wrap(options[:parameters])
    @dimension_parameters = Array.wrap(options[:dimension_parameters])
    @latitude_dim_name = options[:latitude_dim_name]
    @longitude_dim_name = options[:longitude_dim_name]
    @template_params = {}
    @can_subset = false
  end

  def apply_subsetting(options)
    unless options.present?
      @can_subset = false
      @template_params = {}
      return
    end

    extension = ""
    can_subset = false
    format_name = options['format']
    format = @formats.find {|f| f[:name] == format_name}
    if format
      extension = format[:ext]
      can_subset = format[:canSubset]
    end

    subset_parameters = Array.wrap(options['parameters']).map do |param_name|
      @parameters.find { |param| param[:id] == param_name}
    end
    subset_parameters.compact!

    min_lat = -90.0
    max_lat = 90.0
    min_lng = -180.0
    max_lng = 180.0
    mbr = options['spatial']
    if mbr.present?
      min_lat, min_lng, max_lat, max_lng = *mbr
    end

    params = []

    (subset_parameters + @dimension_parameters).each do |param|
      param_str = param[:id]

      constraint_str = ""
      constrained = false
      param[:dimensions].each do |dim|
        name = dim[:name]
        size = dim[:size]
        min = 0
        max = size - 1

        if name == @latitude_dim_name
          min = [((90 + min_lat) * (size / 180.0)).floor, min].max
          max = [((90 + max_lat) * (size / 180.0)).ceil, max].min
        elsif name == @longitude_dim_name
          min = [((180 + min_lng) * (size / 360.0)).floor, min].max
          max = [((180 + max_lng) * (size / 360.0)).ceil, max].min
        end

        constrained = true unless min == 0 && max == size - 1
        constraint_str += "[#{min}:#{max}]"
      end

      param_str += constraint_str if constrained
      params << param_str
    end

    @can_subset = can_subset
    @template_params = {
      od_ext: extension,
      od_params: '?' + params.join(',')
    }
  end

  def info_urls_for(granule)
    if @can_subset
      [@template.expand(decorate(granule).merge({od_ext: '.info'}))]
    else
      []
    end
  end

  def urls_for(granule)
    if @can_subset
      [@template.expand(decorate(granule).merge(@template_params))]
    else
      links = Array.wrap(granule['links'])
      download_links = links.find_all do |link|
        link['rel'].include?('/data') || link['rel'] == 'enclosure'
      end
      download_links.map { |link| link['href'] }
    end
  end

  private

  def decorate(granule)
    extra = {}
    start = granule['time_start']
    if start
      doy = Date.parse(granule['time_start'].slice(0, 10)).yday.to_s.rjust(3, '0')
      month = granule['time_start'].slice(5, 2)
      extra = {od_doy: doy, od_month: month}
    end
    extra.merge(granule)
  end
end
