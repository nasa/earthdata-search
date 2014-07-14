require 'spec_helper'

describe 'Granule details', reset: false do
  it 'displays the granule details' do
    load_page :search
    fill_in 'keywords', with: 'AST_L1AE'
    expect(page).to have_content('ASTER Expedited L1A')
    first_dataset_result.click
    wait_for_xhr
    # Select a specific granule
    click_link 'Filter granules'
    fill_in 'granule_id', with: 'SC:AST_L1AE.003:2132811097'
    click_button 'Apply'
    wait_for_xhr
    first_granule_list_item.click_link('View details')
    wait_for_xhr
    within('#granule-details') do
      expect(page).to have_content('GranuleUR: SC:AST_L1AE.003:2132811097')
      expect(page).to have_content('InsertTime: 2014-07-01T05:29:48.268Z')
      expect(page).to have_content('LastUpdate: 2014-07-01T05:30:28.040Z')
      expect(page).to have_content('Collection: DataSetId: ASTER Expedited L1A Reconstructed Unprocessed Instrument Data V003')
  # DataGranule:
      expect(page).to have_content('SizeMBDataGranule: 84.8118')
      expect(page).to have_content('ProducerGranuleId: AST_L1AE_00307012014095136_20140701052331_17647.hdf')
      expect(page).to have_content('DayNightFlag: UNSPECIFIED')
      expect(page).to have_content('ProductionDateTime: 2014-07-01T10:28:16.000Z')
      expect(page).to have_content('PGEVersionClass: PGEVersion: 06.30R00')
      expect(page).to have_content('Temporal: SingleDateTime: 2014-07-01T09:53:59.317000Z')
      expect(page).to have_content('Spatial: HorizontalSpatialDomain: Geometry: GPolygon:
          Boundary:
              Point:
                PointLongitude: 14.708267
                PointLatitude: 37.7234575249148
              Point:
                PointLongitude: 15.401297
                PointLatitude: 37.6251475702255
              Point:
                PointLongitude: 15.236875
                PointLatitude: 37.0720884481193
              Point:
                PointLongitude: 14.54887
                PointLatitude: 37.1697053909664')
      expect(page).to have_content('MeasuredParameters:
    MeasuredParameter:
      ParameterName: ASTER Expedited LEVEL 1 Data
      QAStats:
        QAPercentMissingData: 0
        QAPercentOutOfBoundsData: 0
        QAPercentInterpolatedData: 0
      QAFlags:
        AutomaticQualityFlag: Passed
        AutomaticQualityFlagExplanation: Passed if algorithm ran within bounds of execution constraints. Suspect if bounds of execution constraints violated. Failed if PGE failed.')
      expect(page).to have_content('AdditionalAttributes:
      AdditionalAttribute:
        Name: ASTERMapProjection
        Values:
          Value: N/A')
      expect(page).to have_content('AdditionalAttribute:
        Name: SceneCloudCoverage
        Values:
          Value: 0')
      expect(page).to have_content('OnlineAccessURLs:
    OnlineAccessURL:
      URL: http://e4ftl01.cr.usgs.gov//ASTER_B/ASTT/AST_L1AE.003/2014.07.01/AST_L1AE_00307012014095136_20140701052331_17647.hdf
      MimeType: application/x-hdfeos')
      expect(page).to have_content('OnlineResources:
    OnlineResource:
      URL: http://e4ftl01.cr.usgs.gov//ASTER_B/ASTT/AST_L1AE.003/2014.07.01/AST_L1AE_00307012014095136_20140701052331_17647.hdf.xml
      Type: METADATA
      MimeType: text/xml')
      expect(page).to have_content('Orderable: true')
      expect(page).to have_content('Visible: true')
      expect(page).to have_content('CloudCover: 0')

    end
  end
end
