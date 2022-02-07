import { prepareRetrievalParams } from '../retrievals'

describe('retrievals', () => {
  test('prepareRetrievalParams', () => {
    const response = prepareRetrievalParams({
      authToken: 'auth-token',
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          'C100000-EDSC': {
            title: 'Vestibulum id ligula porta felis euismod semper.'
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
                hits: 100
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
      },
      router: {
        location: {
          search: '?p=C100000-EDSC'
        }
      },
      shapefile: {}
    })

    expect(response).toEqual({
      authToken: 'auth-token',
      collections: [{
        access_method: {
          id: 'S100000-EDSC',
          isValid: true,
          longName: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
          mbr: {
            neLat: 34.00000001,
            neLng: -76.99999999,
            swLat: 33.99999999,
            swLng: -77.00000001
          },
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
        },
        collection_metadata: {
          title: 'Vestibulum id ligula porta felis euismod semper.'
        },
        granule_count: 100,
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
          options: {
            spatial: {
              or: true
            }
          },
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
