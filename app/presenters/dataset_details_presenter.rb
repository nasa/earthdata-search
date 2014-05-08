class DatasetDetailsPresenter
  def initialize(dataset, collection_id=nil)
    @dataset = dataset
    @dataset.id = collection_id
    @dataset.spatial = spatial(dataset.spatial)
    @dataset.science_keywords = science_keywords(dataset.science_keywords)
    @dataset.contacts = contacts(dataset.contacts)
    @dataset.temporal = temporal(dataset.temporal)
    @dataset.associated_difs = associated_difs(dataset.associated_difs)
    @dataset.online_access_urls = capitilize_descriptions(dataset.online_access_urls) if dataset.online_access_urls
    @dataset.online_resources = capitilize_descriptions(dataset.online_resources) if dataset.online_resources

    metadata_url = "https://api.echo.nasa.gov/catalog-rest/echo_catalog/datasets/#{@dataset.id}"
    @dataset.native_url = "#{metadata_url}"
    @dataset.atom_url = "#{metadata_url}.atom"
    @dataset.echo10_url = "#{metadata_url}.echo10"
    @dataset.iso19115_url = "#{metadata_url}.iso19115"
    @dataset.smap_iso_url = nil #"#{metadata_url}.smap_iso"
  end

  def capitilize_descriptions(urls)
    urls.each do |hash|
      hash['URLDescription'].capitalize! if hash['URLDescription']
      hash['Description'].capitalize! if hash['Description']
    end
  end

  def associated_difs(dif_id)
    url = "http://gcmd.gsfc.nasa.gov/getdif.htm?#{dif_id}"
    {url: url, id: dif_id}
  end

  def temporal(hash)
    if hash && hash['RangeDateTime']
      "#{hash['RangeDateTime']['BeginningDateTime']} to #{hash['RangeDateTime']['EndingDateTime']}"
    else
      'Not available'
    end
  end

  def contacts(hash)
    if hash
      contact_list = Array.wrap(hash.map do |contact_person|
        person = contact_person['ContactPersons']
        if person && person['ContactPerson']
          name = "#{person['ContactPerson']['FirstName']} #{person['ContactPerson']['LastName']}"
        else
          name = contact_person['OrganizationName'] || nil
        end
        if contact_person['OrganizationPhones'] && contact_person['OrganizationPhones']['Phone']
          phone = contact_person['OrganizationPhones']['Phone']
          phones = Array.wrap(phone).map{ |p| "#{p['Number']} (#{p['Type']})" }
        else
          phones = []
        end
        if contact_person['OrganizationEmails']
          email = contact_person['OrganizationEmails']['Email']
        else
          email = nil
        end

        {name: name, phones: phones, email: email}
      end)
    else
      contact_list = ['Not available']
    end

    contact_list
  end

  def science_keywords(keywords)
    if keywords
      keywords.map{ |k| "#{k['CategoryKeyword']} >> #{k['TopicKeyword']} >> #{k['TermKeyword']}" }.uniq
    else
      ['Not available']
    end
  end

  def spatial(hash)
    if hash
      spatial_list = hash.map do |h|
        spatial = []

        if h['HorizontalSpatialDomain']
          geometry = h['HorizontalSpatialDomain']['Geometry']
          if geometry['Point']
            points = Array.wrap(geometry['Point'])

            points.each do |point|
              latitude = point['PointLatitude']
              longitude = point['PointLongitude']
              spatial << "Point: (#{degrees(latitude)}, #{degrees(longitude)})"
            end

          elsif geometry['BoundingRectangle']
            boxes = Array.wrap(geometry['BoundingRectangle'])

            boxes.each do |box|
              north = box['NorthBoundingCoordinate']
              south = box['SouthBoundingCoordinate']
              east = box['EastBoundingCoordinate']
              west = box['WestBoundingCoordinate']
              spatial = "Bounding Rectangle: (#{degrees(north)}, #{degrees(west)}, #{degrees(south)}, #{degrees(east)})"
            end
          elsif geometry['GPolygon']
            polygons = Array.wrap(geometry['GPolygon'])

            polygons.each do |polygon|
              s = "Polygon: ("
              polygon['Boundary'].each do |point|
                point[1].each_with_index do |p, i|
                  latitude = p['PointLatitude']
                  longitude = p['PointLongitude']
                  s += "(#{degrees(latitude)}, #{degrees(longitude)})"
                  s += ", " if i+1 < point[1].size
                end
              end
              s += ")"
              spatial << s
            end

          elsif geometry['Line']
            lines = Array.wrap(geometry['Line'])

            lines.each do |line|
              latitude1 = line['Point'][0]['PointLatitude']
              longitude1 = line['Point'][0]['PointLongitude']
              latitude2 = line['Point'][1]['PointLatitude']
              longitude2 = line['Point'][1]['PointLongitude']
              spatial << "Line: ((#{degrees(latitude1)}, #{degrees(longitude1)}), (#{degrees(latitude2)}, #{degrees(longitude2)}))"
            end
          else
            spatial = ['Not available']
          end
        else
          spatial = ['Not available']
        end

        spatial
      end
    else
      spatial_list = ['Not available']
    end

    spatial_list.flatten
  end

  def degrees(text)
    "#{text}\xC2\xB0"
  end
end
