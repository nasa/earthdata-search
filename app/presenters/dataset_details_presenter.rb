class DatasetDetailsPresenter
  def initialize(dataset)
    @dataset = dataset
    @dataset.spatial = spatial(dataset.spatial)
    @dataset.science_keywords = science_keywords(dataset.science_keywords)
    @dataset.contacts = contacts(dataset.contacts)
    @dataset.temporal = temporal(dataset.temporal)
    @dataset.associated_difs = associated_difs(dataset.associated_difs)
  end

  def associated_difs(dif_id)
    url = "http://gcmd.gsfc.nasa.gov/getdif.htm?#{dif_id}"
    {url: url, id: dif_id}
  end

  def temporal(hash)
    if hash['RangeDateTime']
      "#{hash['RangeDateTime']['BeginningDateTime']} to #{hash['RangeDateTime']['EndingDateTime']}"
    else
      'Not available'
    end
  end

  def contacts(hash)
    person = hash['ContactPersons']
    if person && person['ContactPerson']
      name = "#{person['FirstName']} #{person['LastName']}"
    else
      name = hash['OrganizationName']
    end
    phones = hash['OrganizationPhones']['Phone'].map{|p| "#{p['Number']} (#{p['Type']})"}
    email = hash['OrganizationEmails']['Email']
    {name: name, phones: phones, email: email}
  end

  def science_keywords(keywords)
    if keywords
      keywords.map{ |k| "#{k['CategoryKeyword']} >> #{k['TopicKeyword']} >> #{k['TermKeyword']}" }.uniq
    else
      'Not available'
    end
  end

  def spatial(hash)
    geometry = hash['HorizontalSpatialDomain']['Geometry']
    if geometry['Point']
      latitude = geometry['Point']['PointLatitude']
      longitude = geometry['Point']['PointLongitude']
      return "Point: (#{degrees(latitude)}, #{degrees(longitude)})"
    elsif geometry['BoundingRectangle']
      north = geometry['BoundingRectangle']['NorthBoundingCoordinate']
      south = geometry['BoundingRectangle']['SouthBoundingCoordinate']
      east = geometry['BoundingRectangle']['EastBoundingCoordinate']
      west = geometry['BoundingRectangle']['WestBoundingCoordinate']
      return "Bounding Rectangle: (#{degrees(north)}, #{degrees(west)}, #{degrees(south)}, #{degrees(east)})"
    else
      return 'Not available'
    end
  end

  def degrees(text)
    "#{text}\xC2\xB0"
  end
end
