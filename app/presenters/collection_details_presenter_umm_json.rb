class CollectionDetailsPresenterUmmJson < DetailsPresenterUmmJson
  def initialize(collection, collection_id = nil, token = nil, env = 'prod')
    @collection = collection

    @collection[:id] = collection_id
    @collection[:dataset_id] = collection_id
    @collection[:description] = collection['Abstract']
    @collection[:short_name] = collection['ShortName']
    @collection[:version_id] = collection['Version']
    @collection[:data_centers] = data_centers(collection['DataCenters'])
    @collection[:processing_level_id] = collection['ProcessingLevel']['Id'] if collection['ProcessingLevel'].present?

    @collection[:temporal] = temporal(collection['TemporalExtents'])
    @collection[:science_keywords] = science_keywords(collection['ScienceKeywords']) if collection['ScienceKeywords']

    @collection[:highlighted_urls] = related_urls(collection, true)
    @collection[:related_urls] = related_urls(collection, false)

    @collection[:online_access_urls] = collection['RelatedUrls'].select { |ru| ru['Relation'].present? && ru['Relation'].include?('GET DATA') }.map { |ru| ru['URLs'] } .flatten if collection['RelatedUrls'].present?
    @collection[:spatial] = spatial(collection['SpatialExtent'])

    # TODO
    @collection[:online_resources] = nil
    @collection[:orderable] = nil
    @collection[:visible] = nil
    @collection[:associated_difs] = nil
    @collection[:browse_images] = nil
    ##

    @collection[:granule_url] = "#{Rails.configuration.services['earthdata'][env]['cmr_root']}/search/granules.json"

    metadata_url = "#{Rails.configuration.services['earthdata'][env]['cmr_root']}/search/concepts/#{@collection[:id]}"
    url_token = "?token=#{token}:#{client_id(env)}" if token
    @collection[:html_url] = "#{metadata_url}.html#{url_token}"
    @collection[:native_url] = "#{metadata_url}.native#{url_token}"
    @collection[:atom_url] = "#{metadata_url}.atom#{url_token}"
    @collection[:echo10_url] = "#{metadata_url}.echo10#{url_token}"
    @collection[:iso19115_url] = "#{metadata_url}.iso19115#{url_token}"
    @collection[:dif_url] = "#{metadata_url}.dif#{url_token}"
    @collection[:smap_iso_url] = nil # "#{metadata_url}.smap_iso"
    opensearch_url = "#{Rails.configuration.services['earthdata'][env]['opensearch_root']}/granules/descriptor_document.xml"
    provider = ''
    provider = collection_id.split('-').last if collection_id.is_a?(String)
    @collection[:osdd_url] = "#{opensearch_url}?utf8=%E2%9C%93&clientId=#{Rails.configuration.cmr_client_id}&shortName=#{URI.encode_www_form_component(@collection[:short_name])}&versionId=#{@collection[:version_id]}&dataCenter=#{URI.encode_www_form_component(provider)}&commit=Generate#{url_token}"
  end

  def data_centers(data_centers)
    return nil unless data_centers.present? && data_centers.size > 0
    data_centers.map do |dc|
      {
          shortname_roles: "#{dc['ShortName'].downcase == 'not provided' ? 'Name Not Provided' : dc['ShortName']} (#{dc['Roles'].join(', ')})",
          longname:"#{dc['LongName']}",
          # contact_groups: dc['ContactGroups'] ? contact_groups(dc['ContactGroups']) : nil,
          # contact_persons: dc['ContactPersons'] ? contact_persons(dc['ContactPersons']) : nil,
          contact_information: dc['ContactInformation'] ? dc['ContactInformation'] : nil
      }
    end
  end

  def contact_groups(contact_groups)
    contact_groups.map do |cg|
      {
          name: "#{cg['GroupName']} (#{cg['Roles'].join(', ')})",
          contact_information: cg['ContactInformation'] ? cg['ContactInformation'] : nil
      }
    end
  end

  def contact_persons(contact_persons)
    contact_persons.map do |cp|
      {
          name: "#{cp['FirstName'] ? cp['FirstName'] + ' ' : nil}#{cp['LastName']} (#{cp['Roles'].join(', ')})",
          contact_information: cp['ContactInformation'] ? cp['ContactInformation'] : nil
      }
    end
  end

  def associated_difs(dif_id)
    url = "http://gcmd.gsfc.nasa.gov/getdif.htm?#{dif_id}"
    { url: url, id: dif_id }
  end

  def science_keywords(keywords)
    if keywords
      keywords.map { |k| [k['Category'].titleize, k['Topic'].titleize, k['Term'].titleize] }.uniq
    else
      []
    end
  end

  def spatial(hash)
    return nil unless hash.present?

    spatial_list = []
    if hash['HorizontalSpatialDomain']
      geometry = hash['HorizontalSpatialDomain']['Geometry']
      if geometry['Points']
        points = Array.wrap(geometry['Points'])
        points.each do |point|
          latitude = point['Latitude']
          longitude = point['Longitude']
          spatial_list << "Point: (#{degrees(latitude)}, #{degrees(longitude)})"
        end
      elsif geometry['BoundingRectangles']
        boxes = Array.wrap(geometry['BoundingRectangles'])
        boxes.each do |box|
          north = box['NorthBoundingCoordinate']
          south = box['SouthBoundingCoordinate']
          east = box['EastBoundingCoordinate']
          west = box['WestBoundingCoordinate']
          spatial_list << "Bounding Rectangle: (#{degrees(north)}, #{degrees(west)}, #{degrees(south)}, #{degrees(east)})"
        end
      elsif geometry['GPolygons']
        polygons = Array.wrap(geometry['GPolygons'])
        polygons.each do |polygon|
          s = 'Polygon: ('
          polygon['Boundary']['Points'].each_with_index do |point, i|
            latitude = point['Latitude']
            longitude = point['Longitude']
            s += "(#{degrees(latitude)}, #{degrees(longitude)})"
            s += ', ' if i + 1 < polygon['Boundary']['Points'].size
          end
          s += ')'
          spatial_list << s
        end
      elsif geometry['Line']
        lines = Array.wrap(geometry['Line'])
        lines.each do |line|
          latitude1 = line['Points'][0]['Latitude']
          longitude1 = line['Points'][0]['Longitude']
          latitude2 = line['Points'][1]['Latitude']
          longitude2 = line['Points'][1]['Longitude']
          spatial_list << "Line: ((#{degrees(latitude1)}, #{degrees(longitude1)}), (#{degrees(latitude2)}, #{degrees(longitude2)}))"
        end
      else
        spatial_list = ['Not available']
      end
    else
      spatial_list = ['Not available']
    end

    spatial_list.flatten
  end

  def related_urls(collection, highlighted_only = false)
    related_urls = []

    collection.fetch('RelatedUrls', []).each do |related_url|
      content_type = related_url.fetch('URLContentType', '').downcase
      type = related_url.fetch('Type', '').downcase
      subtype = related_url.fetch('Subtype', '').downcase

      if highlighted_only
        if content_type == 'collectionurl' && type == 'data set landing page'
          name = 'Data Set Landing Page'
        end
        if content_type == 'publicationurl' && type == 'view related information'
          name = 'QA' if subtype == 'data quality'
          name = 'ATBD' if subtype == 'algorithm theoretical basis document'
          name = "User's Guide" if subtype == "user's guide"
        end

        next unless ['Data Set Landing Page', 'QA', 'ATBD', "User\'s Guide"].include?(name)
      else
        name = type.titleize
        name = subtype.titleize unless subtype.empty?
      end

      url = related_url.fetch('URL', '')

      related_urls << {
        url: format_url(url),
        name: name
      }
    end

    related_urls
  end

  def format_url(url)
    unless url =~ %r{^(http|https)\:\/\/}
      url = 'http://' + url
    end
    url
  end
end
