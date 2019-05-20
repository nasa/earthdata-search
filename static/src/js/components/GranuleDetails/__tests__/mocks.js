export const granuleResultsBodyProps = {
  json: {
    Granule: {
      GranuleUR: '1860_1993_2050_NITROGEN.N-deposition1860.tfw',
      InsertTime: '2006-04-14T00:00:00Z',
      LastUpdate: '2006-04-14T00:00:00Z',
      Collection: {
        ShortName: '1860_1993_2050_NITROGEN_830',
        VersionId: 1
      },
      DataGranule: {
        SizeMBDataGranule: 0.0002,
        DayNightFlag: 'BOTH',
        ProductionDateTime: '2006-04-14T00:00:00Z'
      },
      Temporal: {
        RangeDateTime: {
          BeginningDateTime: '1860-01-01T00:00:00Z',
          EndingDateTime: '2050-12-31T00:00:00Z'
        }
      },
      Spatial: {
        HorizontalSpatialDomain: {
          Geometry: {
            BoundingRectangle: {
              WestBoundingCoordinate: -180,
              NorthBoundingCoordinate: 90,
              EastBoundingCoordinate: 180,
              SouthBoundingCoordinate: -90
            }
          }
        }
      },
      MeasuredParameters: {
        MeasuredParameter: [
          {
            ParameterName: 'NITROGEN OXIDES'
          },
          {
            ParameterName: 'NITROGEN COMPOUNDS'
          }
        ]
      },
      Platforms: {
        Platform: {
          ShortName: 'NOT APPLICABLE',
          Instruments: {
            Instrument: {
              ShortName: 'NOT APPLICABLE'
            }
          }
        }
      },
      Campaigns: {
        Campaign: {
          ShortName: 'climate'
        }
      },
      Price: 0,
      OnlineAccessURLs: {
        OnlineAccessURL: {
          URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/N-deposition1860.tfw',
          URLDescription: 'This link provides direct download access to the granule.'
        }
      },
      OnlineResources: {
        OnlineResource: [
          {
            URL: 'https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html',
            Description: 'ORNL DAAC Data Set Documentation',
            Type: 'USERS GUIDE'
          },
          {
            URL: 'https://dx.doi.org/doi:10.3334/ORNLDAAC/830',
            Description: 'Data set Landing Page DOI URL',
            Type: 'DATA SET LANDING PAGE'
          },
          {
            URL: 'https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg',
            Description: 'Data Set Documentation',
            Type: 'GENERAL DOCUMENTATION'
          },
          {
            URL: 'https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf',
            Description: 'Data Set Documentation',
            Type: 'GENERAL DOCUMENTATION'
          },
          {
            URL: 'https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf',
            Description: 'Data Set Documentation',
            Type: 'GENERAL DOCUMENTATION'
          }
        ]
      },
      Orderable: false,
      DataFormat: 'ascii'
    }
  },
  metadataUrls: {
    atom: {
      title: 'ATOM',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.atom'
    },
    echo10: {
      title: 'ECHO 10',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.echo10'
    },
    iso19115: {
      title: 'ISO 19115',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.iso19115'
    },
    native: {
      title: 'Native',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC'
    },
    umm_json: {
      title: 'UMM-G',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.umm_json'
    }
  },
  xml: '<Granule>\n    <GranuleUR>1860_1993_2050_NITROGEN.N-deposition1860.tfw</GranuleUR>\n    <InsertTime>2006-04-14T00:00:00Z</InsertTime>\n    <LastUpdate>2006-04-14T00:00:00Z</LastUpdate>\n    <Collection>\n        <ShortName>1860_1993_2050_NITROGEN_830</ShortName>\n        <VersionId>1</VersionId>\n    </Collection>\n    <DataGranule>\n        <SizeMBDataGranule>0.0002</SizeMBDataGranule>\n        <DayNightFlag>BOTH</DayNightFlag>\n        <ProductionDateTime>2006-04-14T00:00:00Z</ProductionDateTime>\n    </DataGranule>\n    <Temporal>\n        <RangeDateTime>\n            <BeginningDateTime>1860-01-01T00:00:00Z</BeginningDateTime>\n            <EndingDateTime>2050-12-31T00:00:00Z</EndingDateTime>\n        </RangeDateTime>\n    </Temporal>\n    <Spatial>\n        <HorizontalSpatialDomain>\n            <Geometry>\n                <BoundingRectangle>\n                    <WestBoundingCoordinate>-180</WestBoundingCoordinate>\n                    <NorthBoundingCoordinate>90</NorthBoundingCoordinate>\n                    <EastBoundingCoordinate>180</EastBoundingCoordinate>\n                    <SouthBoundingCoordinate>-90</SouthBoundingCoordinate>\n                </BoundingRectangle>\n            </Geometry>\n        </HorizontalSpatialDomain>\n    </Spatial>\n    <MeasuredParameters>\n        <MeasuredParameter>\n            <ParameterName>NITROGEN OXIDES</ParameterName>\n        </MeasuredParameter>\n        <MeasuredParameter>\n            <ParameterName>NITROGEN COMPOUNDS</ParameterName>\n        </MeasuredParameter>\n    </MeasuredParameters>\n    <Platforms>\n        <Platform>\n            <ShortName>NOT APPLICABLE</ShortName>\n            <Instruments>\n                <Instrument>\n                    <ShortName>NOT APPLICABLE</ShortName>\n                </Instrument>\n            </Instruments>\n        </Platform>\n    </Platforms>\n    <Campaigns>\n        <Campaign>\n            <ShortName>climate</ShortName>\n        </Campaign>\n    </Campaigns>\n    <Price>0</Price>\n    <OnlineAccessURLs>\n        <OnlineAccessURL>\n            <URL>https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/N-deposition1860.tfw</URL>\n            <URLDescription>This link provides direct download access to the granule.</URLDescription>\n        </OnlineAccessURL>\n    </OnlineAccessURLs>\n    <OnlineResources>\n        <OnlineResource>\n            <URL>https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html</URL>\n            <Description>ORNL DAAC Data Set Documentation</Description>\n            <Type>USERS GUIDE</Type>\n        </OnlineResource>\n        <OnlineResource>\n            <URL>https://dx.doi.org/doi:10.3334/ORNLDAAC/830</URL>\n            <Description>Data set Landing Page DOI URL</Description>\n            <Type>DATA SET LANDING PAGE</Type>\n        </OnlineResource>\n        <OnlineResource>\n            <URL>https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg</URL>\n            <Description>Data Set Documentation</Description>\n            <Type>GENERAL DOCUMENTATION</Type>\n        </OnlineResource>\n        <OnlineResource>\n            <URL>https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf</URL>\n            <Description>Data Set Documentation</Description>\n            <Type>GENERAL DOCUMENTATION</Type>\n        </OnlineResource>\n        <OnlineResource>\n            <URL>https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf</URL>\n            <Description>Data Set Documentation</Description>\n            <Type>GENERAL DOCUMENTATION</Type>\n        </OnlineResource>\n    </OnlineResources>\n    <Orderable>false</Orderable>\n    <DataFormat>ascii</DataFormat>\n</Granule>'
}

export const formattedGranuleInformation = `    GranuleUR: 1860_1993_2050_NITROGEN.N-deposition1860.tfw
    InsertTime: 2006-04-14T00:00:00Z
    LastUpdate: 2006-04-14T00:00:00Z
    Collection:
        ShortName: 1860_1993_2050_NITROGEN_830
        VersionId: 1
    DataGranule:
        SizeMBDataGranule: 0.0002
        DayNightFlag: BOTH
        ProductionDateTime: 2006-04-14T00:00:00Z
    Temporal:
        RangeDateTime:
            BeginningDateTime: 1860-01-01T00:00:00Z
            EndingDateTime: 2050-12-31T00:00:00Z
    Spatial:
        HorizontalSpatialDomain:
            Geometry:
                BoundingRectangle:
                    WestBoundingCoordinate: -180
                    NorthBoundingCoordinate: 90
                    EastBoundingCoordinate: 180
                    SouthBoundingCoordinate: -90
    MeasuredParameters:
        MeasuredParameter:
            ParameterName: NITROGEN OXIDES
        MeasuredParameter:
            ParameterName: NITROGEN COMPOUNDS
    Platforms:
        Platform:
            ShortName: NOT APPLICABLE
            Instruments:
                Instrument:
                    ShortName: NOT APPLICABLE
    Campaigns:
        Campaign:
            ShortName: climate
    Price: 0
    OnlineAccessURLs:
        OnlineAccessURL:
            URL: https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/N-deposition1860.tfw
            URLDescription: This link provides direct download access to the granule.
    OnlineResources:
        OnlineResource:
            URL: https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html
            Description: ORNL DAAC Data Set Documentation
            Type: USERS GUIDE
        OnlineResource:
            URL: https://dx.doi.org/doi:10.3334/ORNLDAAC/830
            Description: Data set Landing Page DOI URL
            Type: DATA SET LANDING PAGE
        OnlineResource:
            URL: https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg
            Description: Data Set Documentation
            Type: GENERAL DOCUMENTATION
        OnlineResource:
            URL: https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf
            Description: Data Set Documentation
            Type: GENERAL DOCUMENTATION
        OnlineResource:
            URL: https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf
            Description: Data Set Documentation
            Type: GENERAL DOCUMENTATION
    Orderable: false
    DataFormat: ascii
`
