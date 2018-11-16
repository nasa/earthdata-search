require 'spec_helper'

describe CollectionDetailsPresenterUmmJson do
  before do
    @collection = HashWithIndifferentAccess.new
    @collection[:short_name] = 'MOD02QKM'
    @collection[:version_id] = 5
    @collection[:archive_center] = 'LAADS'
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
    spatial = { 'HorizontalSpatialDomain' => { 'Geometry' => { 'GPolygons' => [{ 'Boundary' => {'Points' => [{ 'Longitude' => '-180.00', 'Latitude' => '-53.00' }, { 'Longitude' => '180.00', 'Latitude' => '-53.00' }, { 'Longitude' => '180.00', 'Latitude' => '-89.00' }, { 'Longitude' => '-180.00', 'Latitude' => '-89.00' }]} }] } } }
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

  it 'converts RelatedUrls to a hash' do
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
    @collection[:related_urls].should eq([{"content_type"=>"CollectionURL", "label"=>"Collection URL", "urls"=>[{"URLContentType"=>"CollectionURL", "Type"=>"DATA SET LANDING PAGE", "URL"=>"http://dx.doi.org/10.5067/AMSR2/A2_DySno_NRT", "HighlightedType"=>"Data Set Landing Page", "Subtype"=>""}]}, {"content_type"=>"DistributionURL", "label"=>"Distribution URL", "urls"=>[]}, {"content_type"=>"PublicationURL", "label"=>"Publication URL", "urls"=>[{"URLContentType"=>"PublicationURL", "Type"=>"VIEW RELATED INFORMATION", "Subtype"=>"USER'S GUIDE", "URL"=>"http://lance.nsstc.nasa.gov/amsr2-science/doc/LANCE_A2_DySno_NRT_dataset.pdf", "HighlightedType"=>"User's Guide"}]}, {"content_type"=>"VisualizationURL", "label"=>"Visualization URL", "urls"=>[{"URLContentType"=>"VisualizationURL", "Type"=>"GET RELATED VISUALIZATION", "URL"=>"https://lance.nsstc.nasa.gov/amsr2-science/browse_png/level3/daysnow/R00/", "Subtype"=>""}]}, {"content_type"=>"HighlightedURL", "label"=>"Highlighted URL", "urls"=>[{"URLContentType"=>"CollectionURL", "Type"=>"DATA SET LANDING PAGE", "URL"=>"http://dx.doi.org/10.5067/AMSR2/A2_DySno_NRT", "HighlightedType"=>"Data Set Landing Page", "Subtype"=>""}, {"URLContentType"=>"PublicationURL", "Type"=>"VIEW RELATED INFORMATION", "Subtype"=>"USER'S GUIDE", "URL"=>"http://lance.nsstc.nasa.gov/amsr2-science/doc/LANCE_A2_DySno_NRT_dataset.pdf", "HighlightedType"=>"User's Guide"}]}])
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
    @collection[:related_urls][4].should eq({"content_type"=>"HighlightedURL", "label"=>"Highlighted URL", "urls"=>[{"URLContentType"=>"CollectionURL", "Type"=>"DATA SET LANDING PAGE", "URL"=>"http://dx.doi.org/10.5067/AMSR2/A2_DySno_NRT", "HighlightedType"=>"Data Set Landing Page", "Subtype"=>""}, {"URLContentType"=>"PublicationURL", "Type"=>"VIEW RELATED INFORMATION", "Subtype"=>"USER'S GUIDE", "URL"=>"http://lance.nsstc.nasa.gov/amsr2-science/doc/LANCE_A2_DySno_NRT_dataset.pdf", "HighlightedType"=>"User's Guide"}]})
  end
end
