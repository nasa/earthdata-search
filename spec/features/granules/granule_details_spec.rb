require 'spec_helper'

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
      expect(page).to have_content('GranuleUR: FIFE_STRM_15M.80611715.s15 
      InsertTime: 2008-12-02T00:00:00Z 
      LastUpdate: 2008-12-02T00:00:00Z 
      Collection: 
      ShortName: FIFE_STRM_15M_1 
      VersionId: 1 
      DataGranule: 
      SizeMBDataGranule: 0.00041 
      DayNightFlag: BOTH 
      ProductionDateTime: 2008-12-02T00:00:00Z 
      Temporal: 
      RangeDateTime: 
      BeginningDateTime: 1988-03-01T00:00:00Z 
      EndingDateTime: 1988-03-04T00:00:00Z 
      Spatial: 
      HorizontalSpatialDomain: 
      Geometry: 
      Point: 
      PointLongitude: -96.595 
      PointLatitude: 39.1019 
      MeasuredParameters: 
      MeasuredParameter: 
      ParameterName: STAGE HEIGHT 
      MeasuredParameter: 
      ParameterName: DISCHARGE/FLOW 
      MeasuredParameter: 
      ParameterName: HYDROPATTERN 
      Platforms: 
      Platform: 
      ShortName: SURFACE WATER WEIR 
      Instruments: 
      Instrument: 
      ShortName: STILLING WELL 
      Campaigns: 
      Campaign: 
      ShortName: FIFE 
      Price: 0 
      OnlineAccessURLs: 
      OnlineAccessURL: 
      URL: https://daac.ornl.gov/daacdata/fife/data/hydrolgy/strm_15m/y1988/80611715.s15 
      URLDescription: This link provides direct download access to the granule. 
      OnlineResources: 
      OnlineResource: 
      URL: https://daac.ornl.gov/FIFE/guides/15_min_strm_flow.html 
      Description: ORNL DAAC Data Set Documentation 
      Type: USERS GUIDE 
      OnlineResource: 
      URL: https://dx.doi.org/doi:10.3334/ORNLDAAC/1 
      Description: Data set Landing Page DOI URL 
      Type: DATA SET LANDING PAGE 
      OnlineResource: 
      URL: https:/daac.ornl.gov/daacdata/fife/document/hydrolgy/15_min_strm_flow.pdf 
      Description: Data Set Documentation 
      Type: GENERAL DOCUMENTATION 
      OnlineResource: 
      URL: https:/daac.ornl.gov/daacdata/fife/document/hydrolgy/strm_15m.doc 
      Description: Data Set Documentation 
      Type: GENERAL DOCUMENTATION 
      OnlineResource: 
      URL: https:/daac.ornl.gov/daacdata/fife/data/hydrolgy/strm_15m/strm_15m.tdf 
      Description: Data Set Documentation 
      Type: GENERAL DOCUMENTATION 
      Orderable: false 
      DataFormat: ascii')
    end
  end
end
