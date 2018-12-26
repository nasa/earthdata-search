require 'rails_helper'

describe 'Granule details' do
  it 'displays the granule details' do
    load_page :search
    fill_in 'keywords', with: 'C179003030-ORNL_DAAC'
    wait_for_xhr
    expect(page).to have_content('15 Minute Stream Flow Data: USGS (FIFE)')
    first_collection_result.click
    wait_for_xhr
    # Select a specific granule
    fill_in 'granule-ids', with: "FIFE_STRM_15M.80611715.s15\t"
    wait_for_xhr
    first_granule_list_item.click_link('View granule details')
    wait_for_xhr
    within('#granule-details') do
      expect(page).to have_content("GranuleUR: FIFE_STRM_15M.80611715.s15\n  InsertTime: 2008-12-02T00:00:00Z\n  LastUpdate: 2008-12-02T00:00:00Z\n  Collection: \n    ShortName: FIFE_STRM_15M_1\n    VersionId: 1\n  DataGranule: \n    SizeMBDataGranule: 0.00041\n    DayNightFlag: BOTH\n    ProductionDateTime: 2008-12-02T00:00:00Z\n  Temporal: \n    RangeDateTime: \n      BeginningDateTime: 1988-03-01T00:00:00Z\n      EndingDateTime: 1988-03-04T00:00:00Z\n  Spatial: \n    HorizontalSpatialDomain: \n      Geometry: \n        Point: \n          PointLongitude: -96.595\n          PointLatitude: 39.1019\n  MeasuredParameters: \n      MeasuredParameter: \n        ParameterName: STAGE HEIGHT\n      MeasuredParameter: \n        ParameterName: DISCHARGE/FLOW\n      MeasuredParameter: \n        ParameterName: HYDROPATTERN\n  Platforms: \n    Platform: \n      ShortName: SURFACE WATER WEIR\n      Instruments: \n        Instrument: \n          ShortName: STILLING WELL\n  Campaigns: \n    Campaign: \n      ShortName: FIFE\n  Price: 0\n  OnlineAccessURLs: \n    OnlineAccessURL: \n      URL: https://daac.ornl.gov/daacdata/fife/data/hydrolgy/strm_15m/y1988/80611715.s15\n      URLDescription: This link provides direct download access to the granule.\n  OnlineResources: \n      OnlineResource: \n        URL: https://daac.ornl.gov/FIFE/guides/15_min_strm_flow.html\n        Description: ORNL DAAC Data Set Documentation\n        Type: USERS GUIDE\n      OnlineResource: \n        URL: https://dx.doi.org/doi:10.3334/ORNLDAAC/1\n        Description: Data set Landing Page DOI URL\n        Type: DATA SET LANDING PAGE\n      OnlineResource: \n        URL: https:/daac.ornl.gov/daacdata/fife/document/hydrolgy/15_min_strm_flow.pdf\n        Description: Data Set Documentation\n        Type: GENERAL DOCUMENTATION\n      OnlineResource: \n        URL: https:/daac.ornl.gov/daacdata/fife/document/hydrolgy/strm_15m.doc\n        Description: Data Set Documentation\n        Type: GENERAL DOCUMENTATION\n      OnlineResource: \n        URL: https:/daac.ornl.gov/daacdata/fife/data/hydrolgy/strm_15m/strm_15m.tdf\n        Description: Data Set Documentation\n        Type: GENERAL DOCUMENTATION\n  Orderable: false\n  DataFormat: ascii")
    end
  end
end
