require 'spec_helper'

describe CollectionDetailsPresenterUmmJson do
  before do
    @collection = HashWithIndifferentAccess.new
    @collection[:short_name] = 'MOD02QKM'
    @collection[:version_id] = 5
    @collection[:archive_center] = 'LAADS'
  end

  # Skipped, no mapping from ECHo10 to UMM-C on this field
  xit 'converts difs' do
    dif_id = 'DIF_123'
    @collection.associated_difs = dif_id
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection.associated_difs.should eq(url: "http://gcmd.gsfc.nasa.gov/getdif.htm?#{dif_id}", id: dif_id)
  end

  it 'converts opensearch descriptive document (OSDD)' do
    @collection['ShortName'] = 'MOD02QKM'
    @collection['Version'] = 5
    @collection['DataCenters'] = [{
      'Roles' => ['ARCHIVER'],
      'ShortName' => 'LAADS',
      'ContactGroups' => [],
      'ContactPersons' => []
    }]
    CollectionDetailsPresenterUmmJson.new(@collection, 'C123-LAADS')

    expect(@collection[:osdd_url]).to eq("https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?utf8=%E2%9C%93&clientId=#{Rails.configuration.cmr_client_id}&shortName=MOD02QKM&versionId=5&dataCenter=LAADS&commit=Generate")
  end

  it 'converts spatial points' do
    spatial = { 'HorizontalSpatialDomain' => { 'Geometry' => { 'Points' => [{ 'Longitude' => '-96.6', 'Latitude' => '39.1' }] } } }
    @collection['SpatialExtent'] = spatial
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:spatial].should eq(["Point: (39.1\xC2\xB0, -96.6\xC2\xB0)"])
  end

  it 'converts spatial lines' do
    spatial = { 'HorizontalSpatialDomain' => { 'Geometry' => { 'Line' => { 'Points' => [{ 'Longitude' => '-55.0364', 'Latitude' => '-2.855' }, { 'Longitude' => '-54.959', 'Latitude' => '-2.855' }] } } } }
    @collection['SpatialExtent'] = spatial
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:spatial].should eq(["Line: ((-2.855\xC2\xB0, -55.0364\xC2\xB0), (-2.855\xC2\xB0, -54.959\xC2\xB0))"])
  end

  it 'converts spatial polygons' do
    spatial = { 'HorizontalSpatialDomain' => { 'Geometry' => { 'GPolygons' => [{ 'Boundary' => [{ 'Longitude' => '-180.00', 'Latitude' => '-53.00' }, { 'Longitude' => '180.00', 'Latitude' => '-53.00' }, { 'Longitude' => '180.00', 'Latitude' => '-89.00' }, { 'Longitude' => '-180.00', 'Latitude' => '-89.00' }] }] } } }
    @collection['SpatialExtent'] = spatial
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:spatial].should eq(["Polygon: ((-53.00\xC2\xB0, -180.00\xC2\xB0), (-53.00\xC2\xB0, 180.00\xC2\xB0), (-89.00\xC2\xB0, 180.00\xC2\xB0), (-89.00\xC2\xB0, -180.00\xC2\xB0))"])
  end

  it 'converts spatial boxes' do
    spatial = { 'HorizontalSpatialDomain' => { 'Geometry' => { 'BoundingRectangles' => [{ 'WestBoundingCoordinate' => '-180', 'NorthBoundingCoordinate' => '90', 'EastBoundingCoordinate' => '180', 'SouthBoundingCoordinate' => '-55' }] } } }
    @collection['SpatialExtent'] = spatial
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:spatial].should eq(["Bounding Rectangle: (90\xC2\xB0, -180\xC2\xB0, -55\xC2\xB0, 180\xC2\xB0)"])
  end

  it 'converts science keywords' do
    keywords = [{ 'Category' => 'EARTH SCIENCE', 'Topic' => 'BIOSPHERE', 'Term' => 'VEGETATION', 'VariableLevel1' => { 'Value' => 'FORESTS' } }, { 'Category' => 'EARTH SCIENCE', 'Topic' => 'BIOSPHERE', 'Term' => 'ECOLOGICAL DYNAMICS', 'VariableLevel1' => { 'Value' => 'ECOSYSTEM FUNCTIONS' } }]
    @collection['ScienceKeywords'] = keywords
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:science_keywords].should eq([['Earth Science', 'Biosphere', 'Vegetation'], ['Earth Science', 'Biosphere', 'Ecological Dynamics']])
  end

  it 'converts temporal' do
    temporal = { 'RangeDateTimes' => [{ 'BeginningDateTime' => '1984-12-25T00:00:00.000Z', 'EndingDateTime' => '1988-03-04T00:00:00.000Z' }] }
    @collection['TemporalExtents'] = temporal
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:temporal].should eq(['1984-12-25 to 1988-03-04'])
  end

  it 'converts contacts' do
    data_centers = [{ 'Roles' => ['PROCESSOR'], 'ShortName' => 'AMSR-E SIPS-GHRC', 'ContactGroups' => [], 'ContactPersons' => [] }, { 'Roles' => ['ARCHIVER'], 'ShortName' => 'NSIDC', 'ContactGroups' => [], 'ContactPersons' => [] }, { 'Roles' => ['ORIGINATOR'], 'ShortName' => 'Not provided', 'ContactGroups' => [], 'ContactPersons' => [{ 'Roles' => ['Technical Contact'], 'FirstName' => 'Eni', 'LastName' => 'Njoku' }], 'ContactInformation' => { 'ContactMechanisms' => [{ 'Type' => 'Email', 'Value' => 'eni.g.njoku@jpl.nasa.gov' }], 'Addresses' => [{ 'StreetAddresses' => ['M/S 300-233, Jet Propulsion Laboratory, 4800 Oak Grove Drive'], 'City' => 'Pasadena', 'StateProvince' => 'CA', 'Country' => 'USA', 'PostalCode' => '91109' }] } }, { 'Roles' => ['ARCHIVER'], 'ShortName' => 'NASA DAAC at the National Snow and Ice Data Center', 'ContactGroups' => [], 'ContactPersons' => [], 'ContactInformation' => { 'ServiceHours' => '9=>00 A.M. to 5=>00 P.M., U.S. Mountain Time, Monday through Friday, excluding U.S. holidays.', 'ContactInstruction' => 'Contact by e-mail first', 'ContactMechanisms' => [{ 'Type' => 'Telephone', 'Value' => '303-492-6199' }, { 'Type' => 'Fax', 'Value' => '303-492-2468' }, { 'Type' => 'Email', 'Value' => 'nsidc@nsidc.org' }], 'Addresses' => [{ 'StreetAddresses' => ['1540 30th St Campus Box 449'], 'City' => 'Boulder', 'StateProvince' => 'Colorado', 'Country' => 'USA', 'PostalCode' => '80309-0449' }] } }]
    @collection['DataCenters'] = data_centers
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:contacts].should eq([{ 'name' => 'Eni Njoku', 'contact_mechanisms' => ['eni.g.njoku@jpl.nasa.gov'] }, { 'name' => 'NASA DAAC at the National Snow and Ice Data Center', 'contact_mechanisms' => ['303-492-6199 (Telephone)', '303-492-2468 (Fax)', 'nsidc@nsidc.org'] }])
  end

  # No longer applicable
  xit "ignores 'unknown' value for first/last name in contacts" do
    contacts = [{ 'OrganizationPhones' => { 'Phone' => [{ 'Number' => '(865) 241-3952', 'Type' => 'Direct Line' }, { 'Number' => '(865) 574-4665', 'Type' => 'Fax' }] }, 'OrganizationEmails' => { 'Email' => 'ornldaac@ornl.gov' }, 'ContactPersons' => { 'ContactPerson' => { 'FirstName' => 'unknown', 'LastName' => 'ORNL DAAC User Services' } } }]
    @collection.contacts = contacts
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection.contacts.should eq([{ name: 'ORNL DAAC User Services', phones: ['(865) 241-3952 (Direct Line)', '(865) 574-4665 (Fax)'], email: 'ornldaac@ornl.gov' }])

    contacts = [{ 'OrganizationPhones' => { 'Phone' => [{ 'Number' => '(865) 241-3952', 'Type' => 'Direct Line' }, { 'Number' => '(865) 574-4665', 'Type' => 'Fax' }] }, 'OrganizationEmails' => { 'Email' => 'ornldaac@ornl.gov' }, 'ContactPersons' => { 'ContactPerson' => { 'FirstName' => 'PLEASE CONTACT', 'LastName' => 'unknown' } } }]
    @collection.contacts = contacts
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection.contacts.should eq([{ name: 'PLEASE CONTACT', phones: ['(865) 241-3952 (Direct Line)', '(865) 574-4665 (Fax)'], email: 'ornldaac@ornl.gov' }])
  end

  # No longer applicable
  xit 'uses the Online Access URL as description if no description exists' do
    online_access_urls = [{ 'URL' => 'http://www.example.com' }]
    @collection.online_access_urls = online_access_urls
    CollectionDetailsPresenterUmmJson.new(@collection)
    expect(@collection.online_access_urls).to eq([{ 'URL' => 'http://www.example.com', 'description' => 'http://www.example.com' }])
  end

  it 'converts no contacts to empty array' do
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:contacts].should eq([])
  end

  it 'converts RelatedUrls to a name and url' do
    related_urls = [
      {
        'URLContentType' => 'CollectionURL',
        'Type' => 'DATA SET LANDING PAGE',
        'URL' => 'http://dx.doi.org/10.5067/AMSR2/A2_DySno_NRT'
      },
      {
        'URLContentType' => 'PublicationURL',
        'Type' => 'VIEW RELATED INFORMATION',
        'Subtype' => "USER'S GUIDE",
        'URL' => 'http://lance.nsstc.nasa.gov/amsr2-science/doc/LANCE_A2_DySno_NRT_dataset.pdf'
      },
      {
        'URLContentType' => 'VisualizationURL',
        'Type' => 'GET RELATED VISUALIZATION',
        'URL' => 'https://lance.nsstc.nasa.gov/amsr2-science/browse_png/level3/daysnow/R00/'
      }
    ]

    @collection['RelatedUrls'] = related_urls
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:related_urls].should eq([{ 'url' => 'http://dx.doi.org/10.5067/AMSR2/A2_DySno_NRT', 'name' => 'Data Set Landing Page' }, { 'url' => 'http://lance.nsstc.nasa.gov/amsr2-science/doc/LANCE_A2_DySno_NRT_dataset.pdf', 'name' => "User's Guide" }, { 'url' => 'https://lance.nsstc.nasa.gov/amsr2-science/browse_png/level3/daysnow/R00/', 'name' => 'Get Related Visualization' }])
  end

  it 'converts RelatedUrls to highlighted urls' do
    related_urls = [
      {
        'URLContentType' => 'CollectionURL',
        'Type' => 'DATA SET LANDING PAGE',
        'URL' => 'http://dx.doi.org/10.5067/AMSR2/A2_DySno_NRT'
      },
      {
        'URLContentType' => 'PublicationURL',
        'Type' => 'VIEW RELATED INFORMATION',
        'Subtype' => "USER'S GUIDE",
        'URL' => 'http://lance.nsstc.nasa.gov/amsr2-science/doc/LANCE_A2_DySno_NRT_dataset.pdf'
      },
      {
        'URLContentType' => 'VisualizationURL',
        'Type' => 'GET RELATED VISUALIZATION',
        'URL' => 'https://lance.nsstc.nasa.gov/amsr2-science/browse_png/level3/daysnow/R00/'
      }
    ]

    @collection['RelatedUrls'] = related_urls
    CollectionDetailsPresenterUmmJson.new(@collection)
    @collection[:highlighted_urls].should eq([{ 'url' => 'http://dx.doi.org/10.5067/AMSR2/A2_DySno_NRT', 'name' => 'Data Set Landing Page' }, { 'url' => 'http://lance.nsstc.nasa.gov/amsr2-science/doc/LANCE_A2_DySno_NRT_dataset.pdf', 'name' => "User's Guide" }])
  end
end
