export const granuleResultsBodyProps = {
  authToken: '',
  granuleMetadata: {
    TemporalExtent: {
      RangeDateTime: {
        BeginningDateTime: '1860-01-01T00:00:00.000Z',
        EndingDateTime: '2050-12-31T00:00:00.000Z'
      }
    },
    title: '1860_1993_2050_NITROGEN.N-deposition1860.tfw',
    MeasuredParameters: [
      {
        ParameterName: 'NITROGEN OXIDES'
      },
      {
        ParameterName: 'NITROGEN COMPOUNDS'
      }
    ],
    SpatialExtent: {
      HorizontalSpatialDomain: {
        Geometry: {
          BoundingRectangles: [
            {
              WestBoundingCoordinate: -180,
              EastBoundingCoordinate: 180,
              NorthBoundingCoordinate: 90,
              SouthBoundingCoordinate: -90
            }
          ]
        }
      }
    },
    ProviderDates: [
      {
        Date: '2006-04-14T00:00:00.000Z',
        Type: 'Insert'
      },
      {
        Date: '2006-04-14T00:00:00.000Z',
        Type: 'Update'
      }
    ],
    CollectionReference: {
      ShortName: '1860_1993_2050_NITROGEN_830',
      Version: '1'
    },
    RelatedUrls: [
      {
        URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/N-deposition1860.tfw',
        Type: 'GET DATA',
        Description: 'This link provides direct download access to the granule.'
      },
      {
        URL: 'https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html',
        Type: 'VIEW RELATED INFORMATION',
        Description: 'ORNL DAAC Data Set Documentation'
      },
      {
        URL: 'https://dx.doi.org/doi:10.3334/ORNLDAAC/830',
        Type: 'VIEW RELATED INFORMATION',
        Description: 'Data set Landing Page DOI URL'
      },
      {
        URL: 'https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg',
        Type: 'VIEW RELATED INFORMATION',
        Description: 'Data Set Documentation'
      },
      {
        URL: 'https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf',
        Type: 'VIEW RELATED INFORMATION',
        Description: 'Data Set Documentation'
      },
      {
        URL: 'https:/daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf',
        Type: 'VIEW RELATED INFORMATION',
        Description: 'Data Set Documentation'
      }
    ],
    Projects: [
      {
        ShortName: 'Not provided',
        Campaigns: [
          'climate'
        ]
      }
    ],
    DataGranule: {
      DayNightFlag: 'Both',
      ProductionDateTime: '2006-04-14T00:00:00.000Z',
      ArchiveAndDistributionInformation: [
        {
          Name: 'Not provided',
          Size: 0.0002,
          SizeUnit: 'MB'
        }
      ]
    },
    Platforms: [
      {
        ShortName: 'NOT APPLICABLE',
        Instruments: [
          {
            ShortName: 'NOT APPLICABLE'
          }
        ]
      }
    ],
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/granule/v1.6',
      Name: 'UMM-G',
      Version: '1.6'
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
    }
  }
}
