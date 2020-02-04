export const collectionDetailsBodyProps = {
  onToggleRelatedUrlsModal: jest.fn(),
  focusedCollectionMetadata: {
    excludedGranuleIds: [],
    granules: {},
    isCwic: false,
    isVisible: true,
    metadata: {
      processing_level_id: '3',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      },
      boxes: [
        '-90 -180 90 180'
      ],
      time_start: '1860-01-01T00:00:00.000Z',
      version_id: '1',
      updated: '2019-04-15T17:59:28.000Z',
      dataset_id: 'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050',
      has_spatial_subsetting: false,
      has_transforms: false,
      has_variables: false,
      data_center: 'ORNL_DAAC',
      short_name: '1860_1993_2050_NITROGEN_830',
      organizations: [
        'ORNL_DAAC'
      ],
      title: 'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050',
      coordinate_system: 'CARTESIAN',
      summary: 'This data set provides global gridded estimates of atmospheric deposition of total inorganic nitrogen (N), NHx (NH3 and NH4+), and NOy (all oxidized forms of nitrogen other than N2O), in mg N/m2/year, for the years 1860 and 1993 and projections for the year 2050. The data set was generated using a global three-dimensional chemistry-transport model (TM3) with a spatial resolution of 5 degrees longitude by 3.75 degrees latitude (Jeuken et al., 2001; Lelieveld and Dentener, 2000). Nitrogen emissions estimates (Van Aardenne et al., 2001) and projection scenario data (IPCC, 1996; 2000) were used as input to the model.',
      has_granules: true,
      time_end: '2050-12-31T23:59:59.000Z',
      orbit_parameters: {},
      id: 'C179003620-ORNL_DAAC',
      has_formats: false,
      original_format: 'ECHO10',
      archive_center: 'ORNL_DAAC',
      has_temporal_subsetting: false,
      browse_flag: true,
      online_access_flag: true,
      links: [
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          hreflang: 'en-US',
          href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
          hreflang: 'en-US',
          href: 'https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
          hreflang: 'en-US',
          href: 'https://doi.org/10.3334/ORNLDAAC/830'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
          hreflang: 'en-US',
          href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
          hreflang: 'en-US',
          href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
          hreflang: 'en-US',
          href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
          hreflang: 'en-US',
          href: 'https://daac.ornl.gov/graphics/browse/sdat-tds/830_1_fit.png'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
          type: 'application/gml+xml',
          hreflang: 'en-US',
          href: 'https://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=830'
        }
      ],
      is_cwic: false
    },
    ummMetadata: {
      CollectionCitations: [
        {
          OtherCitationDetails: 'Dentener, F.J. 2006. Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050. ORNL DAAC, Oak Ridge, Tennessee, USA. http://dx.doi.org/10.3334/ORNLDAAC/830'
        }
      ],
      MetadataDates: [
        {
          Date: '2006-04-14T00:00:00.000Z',
          Type: 'UPDATE'
        }
      ],
      ShortName: '1860_1993_2050_NITROGEN_830',
      Abstract: 'This data set provides global gridded estimates of atmospheric deposition of total inorganic nitrogen (N), NHx (NH3 and NH4+), and NOy (all oxidized forms of nitrogen other than N2O), in mg N/m2/year, for the years 1860 and 1993 and projections for the year 2050. The data set was generated using a global three-dimensional chemistry-transport model (TM3) with a spatial resolution of 5 degrees longitude by 3.75 degrees latitude (Jeuken et al., 2001; Lelieveld and Dentener, 2000). Nitrogen emissions estimates (Van Aardenne et al., 2001) and projection scenario data (IPCC, 1996; 2000) were used as input to the model.',
      DOI: {
        Authority: 'https://doi.org',
        DOI: '10.3334/ORNLDAAC/830'
      },
      RelatedUrls: [
        {
          Description: 'This link allows direct data access via Earthdata login',
          URLContentType: 'DistributionURL',
          Type: 'GET DATA',
          URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/'
        },
        {
          Description: 'ORNL DAAC Data Set Documentation',
          URLContentType: 'PublicationURL',
          Type: 'VIEW RELATED INFORMATION',
          Subtype: 'GENERAL DOCUMENTATION',
          URL: 'https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html'
        },
        {
          Description: 'Data set Landing Page DOI URL',
          URLContentType: 'CollectionURL',
          Type: 'DATA SET LANDING PAGE',
          URL: 'https://doi.org/10.3334/ORNLDAAC/830'
        },
        {
          Description: 'Data Set Documentation',
          URLContentType: 'PublicationURL',
          Type: 'VIEW RELATED INFORMATION',
          Subtype: 'GENERAL DOCUMENTATION',
          URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg'
        },
        {
          Description: 'Data Set Documentation',
          URLContentType: 'PublicationURL',
          Type: 'VIEW RELATED INFORMATION',
          Subtype: 'GENERAL DOCUMENTATION',
          URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf'
        },
        {
          Description: 'Data Set Documentation',
          URLContentType: 'PublicationURL',
          Type: 'VIEW RELATED INFORMATION',
          Subtype: 'GENERAL DOCUMENTATION',
          URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf'
        },
        {
          Description: 'Browse Image',
          URLContentType: 'VisualizationURL',
          Type: 'GET RELATED VISUALIZATION',
          URL: 'https://daac.ornl.gov/graphics/browse/sdat-tds/830_1_fit.png'
        },
        {
          Description: 'Web Coverage Service for this collection.',
          URLContentType: 'DistributionURL',
          Type: 'USE SERVICE API',
          Subtype: 'WEB COVERAGE SERVICE (WCS)',
          URL: 'https://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=830',
          GetService: {
            MimeType: 'application/gml+xml',
            Protocol: 'Not provided',
            FullName: 'Not provided',
            DataID: 'Not provided',
            DataType: 'Not provided'
          }
        }
      ],
      DataDates: [
        {
          Date: '2006-04-14T00:00:00.000Z',
          Type: 'CREATE'
        },
        {
          Date: '2019-04-15T17:59:28.000Z',
          Type: 'UPDATE'
        }
      ],
      SpatialExtent: {
        SpatialCoverageType: 'HORIZONTAL',
        HorizontalSpatialDomain: {
          Geometry: {
            CoordinateSystem: 'CARTESIAN',
            BoundingRectangles: [
              {
                WestBoundingCoordinate: -180,
                NorthBoundingCoordinate: 90,
                EastBoundingCoordinate: 180,
                SouthBoundingCoordinate: -90
              }
            ]
          }
        },
        GranuleSpatialRepresentation: 'CARTESIAN'
      },
      ArchiveAndDistributionInformation: {
        FileDistributionInformation: [
          {
            FormatType: 'Native',
            Fees: '0',
            Format: 'Not provided'
          }
        ]
      },
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC CHEMISTRY',
          VariableLevel1: 'NITROGEN COMPOUNDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC CHEMISTRY',
          VariableLevel1: 'NITROGEN COMPOUNDS',
          VariableLevel2: 'NITROGEN OXIDES'
        }
      ],
      EntryTitle: 'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050',
      CollectionProgress: 'COMPLETE',
      ProcessingLevel: {
        ProcessingLevelDescription: 'Variables mapped on uniform space-time grid scales with completeness and consistency',
        Id: '3'
      },
      Platforms: [
        {
          Type: 'NOT APPLICABLE',
          ShortName: 'NOT APPLICABLE',
          Instruments: [
            {
              ShortName: 'NOT APPLICABLE'
            }
          ]
        }
      ],
      Projects: [
        {
          ShortName: 'Climate',
          LongName: 'Climate Collection'
        }
      ],
      Version: '1',
      TemporalExtents: [
        {
          EndsAtPresentFlag: false,
          RangeDateTimes: [
            {
              BeginningDateTime: '1860-01-01T00:00:00.000Z',
              EndingDateTime: '2050-12-31T23:59:59.000Z'
            }
          ]
        }
      ],
      DataCenters: [
        {
          Roles: [
            'ARCHIVER'
          ],
          ShortName: 'ORNL_DAAC',
          ContactInformation: {
            ContactMechanisms: [
              {
                Type: 'Direct Line',
                Value: '(865) 241-3952'
              },
              {
                Type: 'Email',
                Value: 'uso@daac.ornl.gov'
              }
            ],
            Addresses: [
              {
                StreetAddresses: [
                  'ORNL DAAC User Services Office, P.O. Box 2008, MS 6407, Oak Ridge National Laboratory'
                ],
                City: 'Oak Ridge',
                StateProvince: 'Tennessee',
                Country: 'USA',
                PostalCode: '37831-6407'
              }
            ]
          }
        }
      ]
    },
    formattedMetadata: {
      boxes: [
        '-90 -180 90 180'
      ],
      gibsLayers: [
        'None'
      ],
      hasGranules: true,
      id: 'C179003620-ORNL_DAAC',
      isQwic: false,
      shortName: '1860_1993_2050_NITROGEN_830',
      summary: 'This data set provides global gridded estimates of atmospheric deposition of total inorganic nitrogen (N), NHx (NH3 and NH4+), and NOy (all oxidized forms of nitrogen other than N2O), in mg N/m2/year, for the years 1860 and 1993 and projections for the year 2050. The data set was generated using a global three-dimensional chemistry-transport model (TM3) with a spatial resolution of 5 degrees longitude by 3.75 degrees latitude (Jeuken et al., 2001; Lelieveld and Dentener, 2000). Nitrogen emissions estimates (Van Aardenne et al., 2001) and projection scenario data (IPCC, 1996; 2000) were used as input to the model.',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      },
      timeStart: '1860-01-01T00:00:00.000Z',
      timeEnd: '2050-12-31T23:59:59.000Z',
      title: 'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050',
      urls: {
        html: {
          title: 'HTML',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.html'
        },
        native: {
          title: 'Native',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.native'
        },
        atom: {
          title: 'ATOM',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.atom'
        },
        echo10: {
          title: 'ECHO10',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.echo10'
        },
        iso19115: {
          title: 'ISO19115',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.iso19115'
        },
        dif: {
          title: 'DIF',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.dif'
        },
        osdd: {
          title: 'OSDD',
          href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=edsc-prod&shortName=1860_1993_2050_NITROGEN_830&versionId=1&dataCenter=ORNL_DAAC'
        },
        granuleDatasource: {
          title: 'CMR',
          href: 'https://cmr.earthdata.nasa.gov/search/granules.json?echo_collection_id=C179003620-ORNL_DAAC'
        }
      },
      versionId: '1',
      dataCenters: [
        {
          shortname: 'ORNL_DAAC',
          roles: [
            'ARCHIVER'
          ],
          contactInformation: {
            ContactMechanisms: [
              {
                Type: 'Direct Line',
                Value: '(865) 241-3952'
              },
              {
                Type: 'Email',
                Value: 'uso@daac.ornl.gov'
              }
            ],
            Addresses: [
              {
                StreetAddresses: [
                  'ORNL DAAC User Services Office, P.O. Box 2008, MS 6407, Oak Ridge National Laboratory'
                ],
                City: 'Oak Ridge',
                StateProvince: 'Tennessee',
                Country: 'USA',
                PostalCode: '37831-6407'
              }
            ]
          }
        }
      ],
      doi: {
        doiLink: 'https://dx.doi.org/10.3334/ORNLDAAC/830',
        doiText: '10.3334/ORNLDAAC/830'
      },
      nativeFormats: ['Not provided'],
      relatedUrls: [
        {
          contentType: 'CollectionURL',
          label: 'Collection URL',
          urls: [
            {
              Description: 'Data set Landing Page DOI URL',
              URLContentType: 'CollectionURL',
              Type: 'DATA SET LANDING PAGE',
              URL: 'https://doi.org/10.3334/ORNLDAAC/830',
              Subtype: ''
            }
          ]
        },
        {
          contentType: 'DistributionURL',
          label: 'Distribution URL',
          urls: [
            {
              Description: 'This link allows direct data access via Earthdata login',
              URLContentType: 'DistributionURL',
              Type: 'GET DATA',
              URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/',
              Subtype: ''
            },
            {
              Description: 'Web Coverage Service for this collection.',
              URLContentType: 'DistributionURL',
              Type: 'USE SERVICE API',
              Subtype: 'WEB COVERAGE SERVICE (WCS)',
              URL: 'https://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=830',
              GetService: {
                MimeType: 'application/gml+xml',
                Protocol: 'Not provided',
                FullName: 'Not provided',
                DataID: 'Not provided',
                DataType: 'Not provided'
              }
            }
          ]
        },
        {
          contentType: 'PublicationURL',
          label: 'Publication URL',
          urls: [
            {
              Description: 'ORNL DAAC Data Set Documentation',
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION',
              Subtype: 'GENERAL DOCUMENTATION',
              URL: 'https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html'
            },
            {
              Description: 'Data Set Documentation',
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION',
              Subtype: 'GENERAL DOCUMENTATION',
              URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg'
            },
            {
              Description: 'Data Set Documentation',
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION',
              Subtype: 'GENERAL DOCUMENTATION',
              URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf'
            },
            {
              Description: 'Data Set Documentation',
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION',
              Subtype: 'GENERAL DOCUMENTATION',
              URL: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf'
            }
          ]
        },
        {
          contentType: 'VisualizationURL',
          label: 'Visualization URL',
          urls: [
            {
              Description: 'Browse Image',
              URLContentType: 'VisualizationURL',
              Type: 'GET RELATED VISUALIZATION',
              URL: 'https://daac.ornl.gov/graphics/browse/sdat-tds/830_1_fit.png',
              Subtype: ''
            }
          ]
        },
        {
          contentType: 'HighlightedURL',
          label: 'Highlighted URL',
          urls: [
            {
              Description: 'Data set Landing Page DOI URL',
              URLContentType: 'CollectionURL',
              Type: 'DATA SET LANDING PAGE',
              URL: 'https://doi.org/10.3334/ORNLDAAC/830',
              HighlightedType: 'Data Set Landing Page'
            }
          ]
        }
      ],
      scienceKeywords: [
        [
          'Earth Science',
          'Atmosphere',
          'Atmospheric Chemistry'
        ]
      ],
      temporal: [
        '1860-01-01 to 2050-12-31'
      ],
      spatial: [
        'Bounding Rectangle: (90.0°, -180.0°, -90.0°, 180.0°)'
      ]
    }
  }
}

export const metadata = {
  processing_level_id: '3',
  tags: {
    'edsc.extra.handoff.giovanni': {}
  },
  boxes: [
    '-90 -180 90 180'
  ],
  time_start: '1860-01-01T00:00:00.000Z',
  version_id: '1',
  updated: '2019-04-15T17:59:28.000Z',
  dataset_id: 'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050',
  has_spatial_subsetting: false,
  has_transforms: false,
  has_variables: false,
  data_center: 'ORNL_DAAC',
  short_name: '1860_1993_2050_NITROGEN_830',
  organizations: [
    'ORNL_DAAC'
  ],
  title: 'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050',
  coordinate_system: 'CARTESIAN',
  summary: 'This data set provides global gridded estimates of atmospheric deposition of total inorganic nitrogen (N), NHx (NH3 and NH4+), and NOy (all oxidized forms of nitrogen other than N2O), in mg N/m2/year, for the years 1860 and 1993 and projections for the year 2050. The data set was generated using a global three-dimensional chemistry-transport model (TM3) with a spatial resolution of 5 degrees longitude by 3.75 degrees latitude (Jeuken et al., 2001; Lelieveld and Dentener, 2000). Nitrogen emissions estimates (Van Aardenne et al., 2001) and projection scenario data (IPCC, 1996; 2000) were used as input to the model.',
  has_granules: true,
  time_end: '2050-12-31T23:59:59.000Z',
  orbit_parameters: {},
  id: 'C179003620-ORNL_DAAC',
  has_formats: false,
  original_format: 'ECHO10',
  archive_center: 'ORNL_DAAC',
  has_temporal_subsetting: false,
  browse_flag: true,
  online_access_flag: true,
  links: [
    {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
      hreflang: 'en-US',
      href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/'
    },
    {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
      hreflang: 'en-US',
      href: 'https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html'
    },
    {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
      hreflang: 'en-US',
      href: 'https://doi.org/10.3334/ORNLDAAC/830'
    },
    {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
      hreflang: 'en-US',
      href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg'
    },
    {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
      hreflang: 'en-US',
      href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf'
    },
    {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
      hreflang: 'en-US',
      href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf'
    },
    {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
      hreflang: 'en-US',
      href: 'https://daac.ornl.gov/graphics/browse/sdat-tds/830_1_fit.png'
    },
    {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
      type: 'application/gml+xml',
      hreflang: 'en-US',
      href: 'https://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=830'
    }
  ],
  is_cwic: false
}

export default collectionDetailsBodyProps
