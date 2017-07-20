require 'spec_helper'

describe 'Granule details', reset: false do
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
      ShortName: doi:10.3334/ORNLDAAC/1
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
      Sensors:
      Sensor:
      ShortName: STILLING WELL
      Campaigns:
      Campaign:
      ShortName: First ISLSCP Field Experiment (FIFE)
      Price: 0
      OnlineAccessURLs:
      OnlineAccessURL:
      URL: https://daac.ornl.gov/daacdata/fife/data/hydrolgy/strm_15m/y1988/80611715.s15
      URLDescription: USGS 15 minute stream flow data for Kings Creek on the Konza Prairie
      Orderable: false
      DataFormat: txt')

    end
  end
end
