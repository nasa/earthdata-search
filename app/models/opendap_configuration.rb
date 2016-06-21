require 'addressable/template'

class OpendapConfiguration

  # Return true if the given collection object has an opendap link in its metadata
  def self.has_opendap_metadata?(collection)
    collection.present? && Array.wrap(collection['links']).any? do |link|
      link['title'] && link['title'].downcase.include?('opendap')
    end
  end

  # Return the root opendap url to be used for the collection's api endpoint
  def self.opendap_root(collection)
    return nil unless collection.present?

    # Try finding an appropriate link first
    link = Array.wrap(collection['links']).find do |link|
      link['title'] && link['title'].downcase.include?('opendap')
    end

    return link['href'] if link.present? && link['href'].present?

    # Try finding legacy config second
    legacy_config = Rails.configuration.services['opendap'][collection['id']]

    return legacy_config['granule_url_template'].split('{').first if legacy_config.present?

    nil
  end

  # Returns the DDX of some granule in the collection, expected to be the same structure
  # as every granule in the collection
  def self.prototype_ddx(collection_or_id, client, token=nil)
    collection = collection_or_id
    if collection.is_a?(String)
      collection_response = client.get_collection(collection, token, 'json')
      return nil unless collection_response.success?
      collection = collection_response.body
    end

    if (!collection.key?('has_granules') || collection['has_granules']) && has_opendap_metadata?(collection)
      granule = client.get_first_granule(collection, {}, token)
      granule_link = opendap_link(collection['id'], granule)
    end

    ddx_url = nil
    if granule_link.present?
      ddx_url = granule_link.gsub(/\.html.*$/, '') + '.ddx'
    end
    ddx_url
  end

  # Case-insensitive mappings of a single symbolic name to DDX names which can represent that name
  ATTR_MAPPINGS = {
    title: ['title', 'long_name'],
    units: ['units'],
    range: ['valid_range', 'range']
  }

  VALUE_MAPPINGS = {
    nounits: ['nounits']
  }

  DIM_MAPPINGS = {
    lat: ['lat', 'latitude', 'ydim'],
    lon: ['lon', 'longitude', 'xdim']
  }

  # Looks in the attribute array and tries to match the given symbolic key to one of the attributes
  # using the above ATTR_MAPPINGS
  def self.glean_attribute(attribute_array, attr_key)
    mappings = ATTR_MAPPINGS[attr_key]

    attrs = Array.wrap(attribute_array['Attribute'])
    attr = attrs.find do |attr|
      name = attr['name'].downcase
      mappings.any? {|mapping| mapping == name}
    end
    attr && attr['value']
  end

  # Returns true if the given ddx object is something we know what to do with
  def self.can_read_ddx?(parsed_ddx)
    dataset = parsed_ddx['Dataset']
    return false unless dataset.present? && dataset.is_a?(Hash)
    dataset["Array"].present? || dataset['Grid'].present?
  end

  # Given a collection or collection id, finds an opendap configuration for it (which may
  # be an empty opendap config)
  # Future cleanup activity: It's messy that empty opendap configs provide direct download links
  def self.find(collection_or_id, client, token=nil)
    ddx_url = prototype_ddx(collection_or_id, client, token)
    id = collection_or_id.is_a?(String) ? collection_or_id : collection_or_id['id']

    # Get the legacy configuration if no metadata config is available
    old_opendap_config = nil
    unless ddx_url.present?
      old_opendap_config = Rails.configuration.services['opendap'][id]
      ddx_url = old_opendap_config && old_opendap_config['ddx_url']
    end

    return OpendapConfiguration.new(id) unless ddx_url.present?

    ddx = nil
    parsed = {}

    response = self.get_ddx(ddx_url)

    return OpendapConfiguration.new(id) unless response && response.success?
    ddx = response.body
    parsed = MultiXml.parse(ddx)

    return OpendapConfiguration.new(id) unless can_read_ddx?(parsed)

    # At this point, we have a DDX we can parse. So, parse it.
    all_dimensions = Set.new
    parameters = []
    dimension_parameters = []

    dataset = parsed['Dataset']
    arrays = Array.wrap(dataset["Array"]) + Array.wrap(dataset['Grid']).map {|g| g['Array']}
    arrays.each do |array|
      # Transform attribute arrays with their fuzzy-matched non-indexable attributes
      # into a normalized format we can deal with programmatically
      parameter = {
        id: array['name'],
        title: glean_attribute(array, :title),
        range: glean_attribute(array, :range),
        units: glean_attribute(array, :units)
      }
      parameter[:units] = nil if parameter[:units] && VALUE_MAPPINGS.any? {|m| m == parameter[:units].downcase}

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

    # Determine whether / how spatial subsetting is available.
    latitude_dim = dimension_parameters.find do |dim|
      DIM_MAPPINGS[:lat].any? { |map| map == dim[:id].downcase }
    end
    longitude_dim = dimension_parameters.find do |dim|
      DIM_MAPPINGS[:lon].any? { |map| map == dim[:id].downcase }
    end

    can_subset_spatial = latitude_dim && longitude_dim

    # Ensure appropriate ranges are applied to spatial subsetting
    if can_subset_spatial
      unless latitude_dim[:range] && latitude_dim[:range].size == 2
        latitude_dim[:range] = [-90.0, 90.0]
      end
      unless longitude_dim[:range] && longitude_dim[:range].size == 2
        longitude_dim[:range] = [-180.0, 180.0]
      end
    else
      # Avoid a case where we find a latitude and not a longitude
      latitude_dim = longitude_dim = nil
    end

    options = {
      formats: [{name: 'Original (No Subsetting)', ext: '', canSubset: false, canSubsetSpatial: false},
                {name: 'NetCDF', ext: '.nc', canSubset: true, canSubsetSpatial: can_subset_spatial},
                {name: 'ASCII', ext: '.ascii', canSubset: true, canSubsetSpatial: can_subset_spatial}],
      parameters: parameters,
      dimension_parameters: dimension_parameters,
      lat: latitude_dim,
      lon: longitude_dim,
      template: old_opendap_config && old_opendap_config['granule_url_template']
    }
    OpendapConfiguration.new(id, options)
  end

  attr_reader :parameters, :formats

  # Returns true if this can be subset via opendap. Note that even if it's false, we could subset by ESI
  def has_opendap_subsetting?
    @formats.any? {|f| f[:canSubset]}
  end

  def initialize(collection_id, options={})
    @collection_id = collection_id
    @template = Addressable::Template.new(options[:template]) if options[:template].present?
    @formats = Array.wrap(options[:formats])
    @parameters = Array.wrap(options[:parameters])
    @dimension_parameters = Array.wrap(options[:dimension_parameters])
    @url_suffix = ''
    @lat_dim = options[:lat]
    @lon_dim = options[:lon]
  end

  # Translates a set of options into a suffix to use for subsetting (This is pretty stateful)
  def apply_subsetting(options)
    @url_suffix = subset_suffix(options)
  end

  # Given a set of options, gets URL suffix to use for subsetting
  def subset_suffix(options)
    return '' unless options.present?

    format = @formats.find {|f| f[:name] == options['format']}
    suffix = format[:ext] if format

    return suffix if !format || !format[:canSubset]

    subset_parameters = Array.wrap(options['parameters']).map do |param_name|
      @parameters.find { |param| param[:id] == param_name}
    end
    subset_parameters.compact!

    # MBR is dealt with specially. The lat / lon MBR needs to be translated to a set of indices
    # Note: this is possibly the most sketchy part of the assumption about all OPeNDAP DDXes
    #       being the same. If some granules cover more / less latitude or longitude than others,
    #       their array indices could vary. Fixing this would require interrogating the DDX
    #       for every granule. At around .5s per, this would quickly enter timeout territory
    #       without additional effort.
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

        # If the dimension is lat or lon, scale it to the
        if @lat_dim && name == @lat_dim[:id]
          min, max = range_to_dim(@lat_dim, min_lat, max_lat)
        elsif @lon_dim && name == @lon_dim[:id]
          min, max = range_to_dim(@lon_dim, min_lng, max_lng)
        end

        constrained = true unless min == 0 && max == size - 1
        constraint_str += "[#{min}:#{max}]"
      end

      param_str += constraint_str if constrained
      params << param_str
    end

    suffix += "?#{params.join(',')}" if params.present?
    suffix
  end

  # Gets the OPeNDAP .info URL for the granule
  def info_urls_for(granule)
    link = opendap_link(granule)
    if @url_suffix.present? && link.present?
      [link + '.info']
    else
      []
    end
  end

  # Gets the download URLs for the granule, subsetted if available/appropriate
  def download_urls_for(granule)
    link = opendap_link(granule)
    if @url_suffix.present? && link.present?
      [link + @url_suffix]
    else
      links_for(granule, 'enclosure', /\/data/)
    end
  end

  # Gets any browse URLs supplied with the granule
  def browse_urls_for(granule)
    links_for(granule, /\/browse/)
  end

  private

  # Returns the base opendap link for the granule
  def opendap_link(granule)
    result = nil
    if @template
      result = @template.expand(decorate(granule)).to_s
      Rails.logger.info("Using template: #{result}, #{@template.inspect}")
    else
      result = self.class.opendap_link(@collection_id, granule)
      Rails.logger.info("Using metadata: #{result}")
    end
    result
  end

  # Given a value, clamps it to min or max if it is outside that range
  def clamp(value, min, max)
    [[min, value].max, max].min
  end

  # Given an opendap dimension, an a range (min/max), returns an array of
  # two items representing the indices of the range within the opendap dimension
  def range_to_dim(dim, min, max)
    range = dim[:range]
    id = dim[:id]
    spec = dim[:dimensions] && dim[:dimensions].find {|d| d[:name] = id}
    size = dim[:size] || (spec && spec[:size])

    range_min, range_max = range
    span = range_max - range_min
    min = clamp(min, *range)
    max = clamp(max, *range)
    size = size.to_f

    [clamp(((min - range_min) * (size / span)).floor, 0, size),
     clamp(((max - range_min) * (size / span)).ceil, 0, size)]
  end

  # Given a collection id and granule, returns the opendap link contained in the granule (preferentially)
  # or the opendap link as configured in services.yml (fallback) or nil if neither is available
  def self.opendap_link(collection_id, granule)
    # TODO: We need to continue supporting using the legacy config for opendap links for some
    #       period of time. This all, and the find method above, can be greatly simplified
    #       once we're allowed to remove it.
    return nil unless granule.present? && granule['links'].present?

    parent_link = granule['links'].find do |link|
      link['inherited'] && link['href'] && link['title'] && link['title'].downcase.include?('opendap')
    end
    parent_href = nil
    if parent_link
      parent_href = parent_link['href']
      parent_href = File.dirname(parent_href) if parent_href.end_with?('.html')
    end

    own_links = granule['links'].reject {|link| link['inherited'] || !link['href']}

    # Prefer links that say 'opendap' in their title
    opendap_links = own_links.select {|link| link['title'] && link['title'].downcase.include?('opendap')}

    # Next: links that start with their parent collection's opendap URL
    unless opendap_links.present? || !parent_href.present?
      opendap_links = own_links.select {|link| link['href'].downcase.start_with?(parent_href)}
    end

    # Finally: links that have the word 'opendap' in their href
    unless opendap_links.present?
      opendap_links = own_links.select {|link| link['href'].downcase.include?('opendap')}
    end

    # Fix problems where some metadata provides an undesirable .html suffix
    opendap_links.each do |link|
      link['href'].gsub!(/\.html.*$/, '')
    end


    # Return the first such link found (possibly nil)
    opendap_links.first && opendap_links.first['href']
  end

  def links_for(granule, *rels)
    # granule could be nil in some special cases. For example, the selected NRT granule may expire *after* user is on the
    # /data/configure page and *before* submit button is clicked.
    if granule.nil?
      links = []
    else
      links = Array.wrap(granule['links'])
    end
    regexp_rels, string_rels = rels.partition {|rel| rel.is_a?(Regexp)}
    links = links.find_all do |link|
      !link['inherited'] && (string_rels.include?(link) || regexp_rels.any? {|rel| link['rel'][rel]})
    end
    links.map { |link| link['href'] }
  end

  def decorate(granule)
    extra = {}
    start = granule['time_start']
    if start
      day = granule['time_start'].slice(0, 10)
      doy = Date.parse(day).yday.to_s.rjust(3, '0')
      month = granule['time_start'].slice(5, 2)
      extra = {od_doy: doy, od_month: month, od_time_start_dot: day.gsub('-', '.')}
    end
    extra.merge(granule)
  end

  def self.get_ddx(ddx_url)
    connection = Faraday.new(nil, timeout: 2, open_timeout: 4) do |conn|
      conn.response(:logging)
      conn.adapter(Faraday.default_adapter)
    end
    connection.get(ddx_url)
  rescue => e
    # Catch problems caused by read timeouts, etc
    Rails.logger.error e.message
    nil
  end
end
