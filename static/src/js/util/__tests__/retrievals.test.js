import configureStore from '../../store/configureStore'
import useEdscStore from '../../zustand/useEdscStore'
import { prepareRetrievalParams } from '../retrievals'

jest.mock('../../store/configureStore', () => jest.fn())

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
                harmony0: {
                  id: 'S100000-EDSC',
                  isValid: true,
                  longName: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
                  name: 'harmony/gdal-argo Subsetter and Reformatter.',
                  selectedOutputProjection: 'EPSG:4326',
                  supportedOutputFormats: [
                    'TIFF',
                    'PNG',
                    'GIF'
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
              selectedAccessMethod: 'harmony0'
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

    const reduxState = {
      authToken: 'auth-token',
      router: {
        location: {
          search: '?p=C100000-EDSC'
        }
      }
    }

    configureStore.mockReturnValue({
      getState: () => reduxState
    })

    const response = prepareRetrievalParams(reduxState)

    expect(response).toEqual({
      authToken: 'auth-token',
      collections: [{
        access_method: {
          mbr: {
            neLat: 34.00000001,
            neLng: -76.99999999,
            swLat: 33.99999999,
            swLng: -77.00000001
          },
          selectedOutputProjection: 'EPSG:4326',
          type: 'Harmony',
          url: 'https://harmony.sit.earthdata.nasa.gov'
        },
        collection_metadata: {
          conceptId: 'C100000-EDSC',
          dataCenter: 'EDSC',
          directDistributionInformation: {},
          isCSDA: false,
          title: 'Vestibulum id ligula porta felis euismod semper.',
          shortName: 'mock shortName',
          versionId: 'mock version'
        },
        granule_count: 100,
        granule_link_count: 4,
        granule_params: {
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
      json_data: {
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
                harmony0: {
                  id: 'S100000-EDSC',
                  isValid: true,
                  longName: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
                  name: 'harmony/gdal-argo Subsetter and Reformatter.',
                  selectedOutputProjection: 'EPSG:4326',
                  supportedOutputFormats: [
                    'TIFF',
                    'PNG',
                    'GIF'
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
                  }
                }
              },
              granules: {
                count: 100,
                allIds: [],
                byId: {}
              },
              selectedAccessMethod: 'harmony0'
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

    const reduxState = {
      authToken: 'auth-token',
      router: {
        location: {
          search: '?p=C100000-EDSC'
        }
      }
    }

    configureStore.mockReturnValue({
      getState: () => reduxState
    })

    const response = prepareRetrievalParams(reduxState)

    expect(response).toEqual({
      authToken: 'auth-token',
      collections: [{
        access_method: {
          mbr: {
            neLat: 34.00000001,
            neLng: -76.99999999,
            swLat: 33.99999999,
            swLng: -77.00000001
          },
          selectedOutputProjection: 'EPSG:4326',
          type: 'Harmony',
          url: 'https://harmony.sit.earthdata.nasa.gov'
        },
        collection_metadata: {
          conceptId: 'C100000-EDSC',
          dataCenter: 'EDSC',
          directDistributionInformation: {},
          isCSDA: false,
          title: 'Vestibulum id ligula porta felis euismod semper.',
          shortName: 'mock shortName',
          versionId: 'mock version'
        },
        granule_count: 100,
        granule_link_count: 0,
        granule_params: {
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
      json_data: {
        portalId: 'edsc',
        shapefileId: undefined,
        source: '?p=C100000-EDSC'
      }
    })
  })
})
