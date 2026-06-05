import routerHelper from '../../router/router'
import useEdscStore from '../../zustand/useEdscStore'
import { prepareRetrievalParams } from '../retrievals'

beforeEach(() => {
  routerHelper.router.state = {
    location: {
      search: '?p=C100000-EDSC'
    }
  }
})

describe('retrievals', () => {
  test('prepareRetrievalParams', () => {
    useEdscStore.setState({
      collection: {
        collectionMetadata: {
          'C100000-EDSC': {
            conceptId: 'C100000-EDSC',
            dataCenter: 'EDSC',
            directDistributionInformation: {},
            isCSDA: false,
            shortName: 'mock shortName',
            title: 'Vestibulum id ligula porta felis euismod semper.',
            versionId: 'mock version'
          }
        }
      },
      portal: {
        portalId: 'edsc'
      },
      project: {
        collections: {
          allIds: ['C100000-EDSC'],
          byId: {
            'C100000-EDSC': {
              accessMethods: {
                harmony: {
                  id: 'S100000-EDSC',
                  isValid: true,
                  shortName: 'harmony/gdal-argo Subsetter and Reformatter.',
                  outputFormatAvailability: {
                    TIFF: true,
                    PNG: true,
                    GIF: true
                  },
                  enableConcatenateDownload: false,
                  enableSpatialSubsetting: false,
                  enableTemporalSubsetting: false,
                  isOutputFormatsDisabled: false,
                  isBboxSubsettingDisabled: false,
                  isSpatialSubsettingDisabled: false,
                  isTemporalSubsettingDisabled: false,
                  isVariableSubsettingDisabled: false,
                  isConcatenationDisabled: false,
                  hierarchyMappings: [],
                  keywordMappings: [],
                  selectedOutputFormat: undefined,
                  selectedVariables: [],
                  supportsBoundingBoxSubsetting: true,
                  supportsConcatenation: false,
                  supportsShapefileSubsetting: true,
                  supportsTemporalSubsetting: true,
                  supportsVariableSubsetting: true,
                  supportedOutputFormats: [
                    {
                      mimeType: 'TIFF',
                      name: 'TIFF'
                    },
                    {
                      mimeType: 'PNG',
                      name: 'PNG'
                    },
                    {
                      mimeType: 'GIF',
                      name: 'GIF'
                    }
                  ],
                  supportedOutputProjections: [
                    'EPSG:4326'
                  ],
                  type: 'Harmony',
                  url: 'https://harmony.sit.earthdata.nasa.gov',
                  variables: {
                    'V100000-EDSC': {
                      name: 'alpha_var',
                      href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2292306567-POCLOUD',
                      scienceKeywords: [
                        {
                          category: 'EARTH SCIENCE',
                          topic: 'ATMOSPHERE',
                          term: 'ATMOSPHERIC PRESSURE'
                        }
                      ]
                    }
                  },
                  harmonyUserSelections: {},
                  derivedHarmonyState: {},
                  harmonyCapabilitiesDocument: {
                    conceptId: 'C100000-EDSC',
                    shortName: 'Mock',
                    summary: {
                      subsetting: {},
                      reprojection: {},
                      concatenation: false,
                      outputFormats: []
                    },
                    services: [],
                    variables: []
                  }
                }
              },
              granules: {
                count: 100,
                allIds: ['G1000000001-EDSC', 'G1000000002-EDSC'],
                byId: {
                  'G1000000001-EDSC':
                  {
                    links: [{
                      href: 'http://mocklink1'
                    }, {
                      href: 'http://mocklink2'
                    }]
                  },
                  'G1000000002-EDSC':
                  {
                    links: [{
                      href: 'http://mocklink3'
                    }, {
                      href: 'http://mocklink4'
                    }]
                  }
                }
              },
              selectedAccessMethod: 'harmony'
            }
          }
        }
      },
      query: {
        collection: {
          byId: {},
          spatial: {
            point: ['-77, 34']
          }
        }
      }
    })

    const response = prepareRetrievalParams()

    expect(response).toEqual({
      collections: [{
        accessMethod: {
          enableConcatenateDownload: false,
          enableSpatialSubsetting: false,
          enableTemporalSubsetting: false,
          mbr: {
            neLat: 34.00000001,
            neLng: -76.99999999,
            swLat: 33.99999999,
            swLng: -77.00000001
          },
          selectedOutputFormat: undefined,
          selectedVariableNames: [],
          selectedVariables: [],
          supportsBoundingBoxSubsetting: true,
          supportsConcatenation: false,
          supportsShapefileSubsetting: true,
          type: 'Harmony',
          url: 'https://harmony.sit.earthdata.nasa.gov'
        },
        collectionMetadata: {
          conceptId: 'C100000-EDSC',
          dataCenter: 'EDSC',
          directDistributionInformation: {},
          isCSDA: false,
          title: 'Vestibulum id ligula porta felis euismod semper.',
          shortName: 'mock shortName',
          versionId: 'mock version'
        },
        granuleCount: 100,
        granuleLinkCount: 4,
        granuleParams: {
          boundingBox: undefined,
          browseOnly: undefined,
          circle: undefined,
          cloudCover: undefined,
          conceptId: [],
          dayNightFlag: undefined,
          echoCollectionId: 'C100000-EDSC',
          equatorCrossingDate: undefined,
          equatorCrossingLongitude: undefined,
          exclude: {},
          line: undefined,
          onlineOnly: undefined,
          options: {},
          orbitNumber: undefined,
          pageNum: 1,
          pageSize: 20,
          point: [
            '-77, 34'
          ],
          polygon: undefined,
          readableGranuleName: undefined,
          sortKey: undefined,
          temporal: undefined,
          twoDCoordinateSystem: {}
        },
        id: 'C100000-EDSC'
      }],
      environment: 'prod',
      jsondata: {
        portalId: 'edsc',
        shapefileId: undefined,
        source: '?p=C100000-EDSC'
      }
    })
  })

  test('when there are no links on the granules', () => {
    useEdscStore.setState({
      collection: {
        collectionMetadata: {
          'C100000-EDSC': {
            conceptId: 'C100000-EDSC',
            dataCenter: 'EDSC',
            directDistributionInformation: {},
            isCSDA: false,
            shortName: 'mock shortName',
            title: 'Vestibulum id ligula porta felis euismod semper.',
            versionId: 'mock version'
          }
        }
      },
      portal: {
        portalId: 'edsc'
      },
      project: {
        collections: {
          allIds: ['C100000-EDSC'],
          byId: {
            'C100000-EDSC': {
              accessMethods: {
                harmony: {
                  id: 'S100000-EDSC',
                  isValid: true,

                  shortName: 'harmony/gdal-argo Subsetter and Reformatter.',
                  outputFormatAvailability: {
                    TIFF: true,
                    PNG: true,
                    GIF: true
                  },
                  enableConcatenateDownload: false,
                  enableSpatialSubsetting: false,
                  enableTemporalSubsetting: false,
                  isOutputFormatsDisabled: false,
                  isSpatialSubsettingDisabled: false,
                  isTemporalSubsettingDisabled: false,
                  isVariableSubsettingDisabled: false,
                  isConcatenationDisabled: false,
                  hierarchyMappings: [],
                  keywordMappings: [],
                  selectedOutputFormat: undefined,
                  selectedVariables: [],
                  supportsBoundingBoxSubsetting: true,
                  supportsConcatenation: false,
                  supportsShapefileSubsetting: true,
                  supportsTemporalSubsetting: true,
                  supportsVariableSubsetting: true,
                  supportedOutputFormats: [
                    {
                      mimeType: 'TIFF',
                      name: 'TIFF'
                    },
                    {
                      mimeType: 'PNG',
                      name: 'PNG'
                    },
                    {
                      mimeType: 'GIF',
                      name: 'GIF'
                    }
                  ],
                  supportedOutputProjections: [
                    'EPSG:4326'
                  ],
                  type: 'Harmony',
                  url: 'https://harmony.sit.earthdata.nasa.gov',
                  variables: {
                    'V100000-EDSC': {
                      conceptId: 'V100000-EDSC',
                      definition: 'Alpha channel value',
                      longName: 'Alpha channel ',
                      name: 'alpha_var',
                      scienceKeywords: [
                        {
                          category: 'EARTH SCIENCE',
                          topic: 'ATMOSPHERE',
                          term: 'ATMOSPHERIC PRESSURE'
                        }
                      ]
                    }
                  },
                  harmonyUserSelections: {},
                  derivedHarmonyState: {},
                  harmonyCapabilitiesDocument: {
                    conceptId: 'C100000-EDSC',
                    shortName: 'Mock',
                    summary: {
                      subsetting: {},
                      reprojection: {},
                      concatenation: false,
                      outputFormats: []
                    },
                    services: [],
                    variables: []
                  }
                }
              },
              granules: {
                count: 100,
                allIds: [],
                byId: {}
              },
              selectedAccessMethod: 'harmony'
            }
          }
        }
      },
      query: {
        collection: {
          byId: {},
          spatial: {
            point: ['-77, 34']
          }
        }
      }
    })

    const response = prepareRetrievalParams()

    expect(response).toEqual({
      collections: [{
        accessMethod: {
          enableConcatenateDownload: false,
          enableSpatialSubsetting: false,
          enableTemporalSubsetting: false,
          mbr: {
            neLat: 34.00000001,
            neLng: -76.99999999,
            swLat: 33.99999999,
            swLng: -77.00000001
          },
          selectedOutputFormat: undefined,
          selectedVariableNames: [],
          selectedVariables: [],
          supportsBoundingBoxSubsetting: true,
          supportsConcatenation: false,
          supportsShapefileSubsetting: true,
          type: 'Harmony',
          url: 'https://harmony.sit.earthdata.nasa.gov'
        },
        collectionMetadata: {
          conceptId: 'C100000-EDSC',
          dataCenter: 'EDSC',
          directDistributionInformation: {},
          isCSDA: false,
          title: 'Vestibulum id ligula porta felis euismod semper.',
          shortName: 'mock shortName',
          versionId: 'mock version'
        },
        granuleCount: 100,
        granuleLinkCount: 0,
        granuleParams: {
          boundingBox: undefined,
          browseOnly: undefined,
          circle: undefined,
          cloudCover: undefined,
          conceptId: [],
          dayNightFlag: undefined,
          echoCollectionId: 'C100000-EDSC',
          equatorCrossingDate: undefined,
          equatorCrossingLongitude: undefined,
          exclude: {},
          line: undefined,
          onlineOnly: undefined,
          options: {},
          orbitNumber: undefined,
          pageNum: 1,
          pageSize: 20,
          point: [
            '-77, 34'
          ],
          polygon: undefined,
          readableGranuleName: undefined,
          sortKey: undefined,
          temporal: undefined,
          twoDCoordinateSystem: {}
        },
        id: 'C100000-EDSC'
      }],
      environment: 'prod',
      jsondata: {
        portalId: 'edsc',
        selectedFeatures: undefined,
        shapefileId: undefined,
        source: '?p=C100000-EDSC'
      }
    })
  })
})
