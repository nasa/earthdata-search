class CollectionDetailsPresenterUmmJson < DetailsPresenterUmmJson
  def initialize(collection, collection_id = nil, token = nil, env = 'prod')
    @collection = collection

    @collection[:id] = collection_id
    @collection[:dataset_id] = collection_id
    @collection[:description] = collection['Abstract']
    @collection[:short_name] = collection['ShortName']
    @collection[:doi] = doi(collection['DOI'])
    @collection[:version_id] = collection['Version']
    @collection[:data_centers] = data_centers(collection['DataCenters'])
    @collection[:processing_level_id] = collection['ProcessingLevel']['Id'] if collection['ProcessingLevel'].present?

    @collection[:temporal] = temporal(collection['TemporalExtents'])
    @collection[:science_keywords] = science_keywords(collection['ScienceKeywords']) if collection['ScienceKeywords']

    @collection[:related_urls] = related_urls(collection)

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

  def doi(doi)
    if doi && doi['DOI']
      doi = doi['DOI']
      # EDSC-1645: This string varies - clean up permutations so that we start from the same place...
      doi = doi.gsub(/^https?\:\/\//, '')
      doi = doi.gsub("doi:", '')
      doi = doi.gsub("dx.doi.org/", '')
      doi = doi.gsub("doi.org/", '')
      if !doi.blank?
        return {doi_link: "https://dx.doi.org/#{doi}", doi_text: doi} 
      else
        return {doi_text: doi, doi_link: nil}
      end
    end
    {doi_link: nil, doi_text: nil}
  end

  def data_centers(data_centers)
    return nil unless data_centers.present? && data_centers.size > 0
    data_centers.map do |dc|
      {
          shortname: "#{dc['ShortName'].downcase == 'not provided' ? 'Name Not Provided' : dc['ShortName']}",
          roles: dc['Roles'],
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

  def related_urls(collection)
    # order matters
    collection_urls = { content_type: 'CollectionURL', label: 'Collection URL', urls: [] }
    distribution_urls = { content_type: 'DistributionURL', label: 'Distribution URL', urls: [] }
    publication_urls = { content_type: 'PublicationURL', label: 'Publication URL', urls: [] }
    visualization_urls = { content_type: 'VisualizationURL', label: 'Visualization URL', urls: [] }
    highlighted_urls = { content_type: 'HighlightedURL', label: 'Highlighted URL', urls: [] }
    related_urls = [collection_urls, distribution_urls, publication_urls, visualization_urls, highlighted_urls]

    # CMR uses a hard-coded map to do the translation\ cmr_metadata_preview/app/helpers/cmr_metadata_preview/options_helper.rb
    collection.fetch('RelatedUrls', []).each do |ru|
      if ru['URLContentType'] == 'CollectionURL' && ru['Type'] == 'DATA SET LANDING PAGE'
        ru['HighlightedType'] = 'Data Set Landing Page'
        highlighted_urls[:urls].push ru
      end
      if ru['URLContentType'] == 'PublicationURL' && ru['Type'] == 'VIEW RELATED INFORMATION'
        if ru['Subtype'] == 'DATA QUALITY'
          ru['HighlightedType'] = 'QA'
          highlighted_urls[:urls].push ru
        end
        if ru['Subtype'] == 'ALGORITHM THEORETICAL BASIS DOCUMENT'
          ru['HighlightedType'] = 'ATBD'
          highlighted_urls[:urls].push ru
        end
        if ru['Subtype'] == "USER'S GUIDE"
          ru['HighlightedType'] = "User's Guide"
          highlighted_urls[:urls].push ru
        end
      end

      # exclude EDSC and Reverb URLs
      next if ru['URL'] =~ /search\.(?:sit|uat)?\.?earthdata\.nasa\.gov/ || ru['URL'] =~ /echo\.nasa\.gov/

      format_url(ru['URL']) unless ru['URL'].nil?
      ru['Subtype'] = '' if ru['Subtype'].nil?

      if ru['URLContentType'] == 'CollectionURL'
        collection_urls[:urls].push ru
      elsif ru['URLContentType'] == 'DistributionURL'
        distribution_urls[:urls].push ru
      elsif ru['URLContentType'] == 'PublicationURL'
        publication_urls[:urls].push ru
      elsif ru['URLContentType'] == 'VisualizationURL'
        visualization_urls[:urls].push ru
      end
    end

    # URLs should be listed alphabetically and grouped by Type
    related_urls.each do |url_category|
      url_category[:urls].sort_by! {|url| [url['Type'], url['Subtype'], url['URL']]}
    end

    # related_urls should be empty if there are no Related URLs
    related_urls.each {|x| if !(x[:urls].empty?) then return related_urls end}
    []
  end

  def format_url(url)
    unless url =~ %r{^(http|https)\:\/\/}
      url = 'http://' + url
    end
    url
  end
end
