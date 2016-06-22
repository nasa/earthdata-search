require 'spec_helper'

describe CollectionDetailsPresenter do
  before do
    @collection = Echo::Collection.new
    @collection.short_name = "MOD02QKM"
    @collection.version_id = 5
    @collection.archive_center = "LAADS"
  end

  it "converts difs" do
    dif_id = "DIF_123"
    @collection.associated_difs = dif_id
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.associated_difs.should eq({url: "http://gcmd.gsfc.nasa.gov/getdif.htm?#{dif_id}", id: dif_id})
  end

  it "converts opensearch descriptive document (OSDD)" do
    @collection.short_name = "MOD02QKM"
    @collection.version_id = 5
    @collection.archive_center = "LAADS"
    CollectionDetailsPresenter.new(@collection, 'C123-LAADS')

    expect(@collection.osdd_url).to eq("https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?utf8=%E2%9C%93&clientId=#{Rails.configuration.cmr_client_id}&shortName=MOD02QKM&versionId=5&dataCenter=LAADS&commit=Generate")
  end

  it "converts spatial points" do
    spatial = [{"HorizontalSpatialDomain"=>{"Geometry"=>{"Point"=>{"PointLongitude"=>"-96.6", "PointLatitude"=>"39.1"}}}}]
    @collection.spatial = spatial
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.spatial.should eq(["Point: (39.1\xC2\xB0, -96.6\xC2\xB0)"])
  end

  it "converts spatial lines" do
    spatial = [{"HorizontalSpatialDomain"=>{"Geometry"=>{"Line"=>{"Point"=>[{"PointLongitude"=>"-55.0364", "PointLatitude"=>"-2.855"}, {"PointLongitude"=>"-54.959", "PointLatitude"=>"-2.855"}]}}}}]
    @collection.spatial = spatial
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.spatial.should eq(["Line: ((-2.855\xC2\xB0, -55.0364\xC2\xB0), (-2.855\xC2\xB0, -54.959\xC2\xB0))"])
  end

  it "converts spatial polygons" do
    spatial = [{"HorizontalSpatialDomain"=>{"Geometry"=>{"GPolygon"=>[{"Boundary"=>{"Point"=>[{"PointLongitude"=>"-180.00", "PointLatitude"=>"-53.00"}, {"PointLongitude"=>"180.00", "PointLatitude"=>"-53.00"}, {"PointLongitude"=>"180.00", "PointLatitude"=>"-89.00"}, {"PointLongitude"=>"-180.00", "PointLatitude"=>"-89.00"}]}}]}}}]
    @collection.spatial = spatial
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.spatial.should eq(["Polygon: ((-53.00\xC2\xB0, -180.00\xC2\xB0), (-53.00\xC2\xB0, 180.00\xC2\xB0), (-89.00\xC2\xB0, 180.00\xC2\xB0), (-89.00\xC2\xB0, -180.00\xC2\xB0))"])
  end

  it "converts spatial boxes" do
    spatial = [{"HorizontalSpatialDomain"=>{"Geometry"=>{"BoundingRectangle"=>{"WestBoundingCoordinate"=>"-180", "NorthBoundingCoordinate"=>"90", "EastBoundingCoordinate"=>"180", "SouthBoundingCoordinate"=>"-55"}}}}]
    @collection.spatial = spatial
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.spatial.should eq(["Bounding Rectangle: (90\xC2\xB0, -180\xC2\xB0, -55\xC2\xB0, 180\xC2\xB0)"])
  end

  it "converts science keywords" do
    keywords = [{"CategoryKeyword"=>"EARTH SCIENCE", "TopicKeyword"=>"BIOSPHERE", "TermKeyword"=>"VEGETATION", "VariableLevel1Keyword"=>{"Value"=>"FORESTS"}}, {"CategoryKeyword"=>"EARTH SCIENCE", "TopicKeyword"=>"BIOSPHERE", "TermKeyword"=>"ECOLOGICAL DYNAMICS", "VariableLevel1Keyword"=>{"Value"=>"ECOSYSTEM FUNCTIONS"}}]
    @collection.science_keywords = keywords
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.science_keywords.should eq([["Earth Science", "Biosphere", "Vegetation"], ["Earth Science", "Biosphere", "Ecological Dynamics"]])

  end

  it "converts temporal" do
    temporal = {"RangeDateTime"=>{"BeginningDateTime"=>"1984-12-25T00:00:00.000Z", "EndingDateTime"=>"1988-03-04T00:00:00.000Z"}}
    @collection.temporal = temporal
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.temporal.should eq("1984-12-25T00:00:00.000Z to 1988-03-04T00:00:00.000Z")
  end

  it "converts contacts" do
    contacts = [{"OrganizationPhones"=>{"Phone"=>[{"Number"=>"(865) 241-3952", "Type"=>"Direct Line"}, {"Number"=>"(865) 574-4665", "Type"=>"Fax"}]}, "OrganizationEmails"=>{"Email"=>"ornldaac@ornl.gov"}, "ContactPersons"=>{"ContactPerson"=>{"FirstName"=>"PLEASE CONTACT", "LastName"=>"ORNL DAAC User Services"}}}]
    @collection.contacts = contacts
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.contacts.should eq([{:name=>"PLEASE CONTACT ORNL DAAC User Services", :phones=>["(865) 241-3952 (Direct Line)", "(865) 574-4665 (Fax)"], :email=>"ornldaac@ornl.gov"}])
  end

  it "ignores 'unknown' value for first/last name in contacts" do
    contacts = [{"OrganizationPhones"=>{"Phone"=>[{"Number"=>"(865) 241-3952", "Type"=>"Direct Line"}, {"Number"=>"(865) 574-4665", "Type"=>"Fax"}]}, "OrganizationEmails"=>{"Email"=>"ornldaac@ornl.gov"}, "ContactPersons"=>{"ContactPerson"=>{"FirstName"=>"unknown", "LastName"=>"ORNL DAAC User Services"}}}]
    @collection.contacts = contacts
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.contacts.should eq([{:name=>"ORNL DAAC User Services", :phones=>["(865) 241-3952 (Direct Line)", "(865) 574-4665 (Fax)"], :email=>"ornldaac@ornl.gov"}])

    contacts = [{"OrganizationPhones"=>{"Phone"=>[{"Number"=>"(865) 241-3952", "Type"=>"Direct Line"}, {"Number"=>"(865) 574-4665", "Type"=>"Fax"}]}, "OrganizationEmails"=>{"Email"=>"ornldaac@ornl.gov"}, "ContactPersons"=>{"ContactPerson"=>{"FirstName"=>"PLEASE CONTACT", "LastName"=>"unknown"}}}]
    @collection.contacts = contacts
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.contacts.should eq([{:name=>"PLEASE CONTACT", :phones=>["(865) 241-3952 (Direct Line)", "(865) 574-4665 (Fax)"], :email=>"ornldaac@ornl.gov"}])
  end

  it "uses the Online Access URL as description if no description exists" do
    online_access_urls = [{"URL"=>"http://www.example.com"}]
    @collection.online_access_urls = online_access_urls
    presenter = CollectionDetailsPresenter.new(@collection)
    expect(@collection.online_access_urls).to eq([{"URL"=>"http://www.example.com", "description"=>"http://www.example.com"}])
  end

  it "converts no contacts to empty array" do
    @collection.contacts = nil
    presenter = CollectionDetailsPresenter.new(@collection)
    @collection.contacts.should eq([])
  end

end
