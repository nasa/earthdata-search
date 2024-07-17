import { buildAccessMethods } from '../buildAccessMethods'

import * as buildDownload from '../buildAccessMethods/buildDownload'
import * as buildSwodlr from '../buildAccessMethods/buildSwodlr'
import * as buildHarmony from '../buildAccessMethods/buildHarmony'
import * as buildOpendap from '../buildAccessMethods/buildOpendap'
import * as buildEsiEcho from '../buildAccessMethods/buildEsiEcho'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    disableOrdering: 'false'
  }))
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('buildAccessMethods', () => {
  test('calls buildDownload access method', () => {
    const buildDownloadMock = jest.spyOn(buildDownload, 'buildDownload')
    buildDownloadMock.mockImplementationOnce(() => jest.fn())

    const collectionMetadata = {
      granules: {
        items: [{
          online_access_flag: true
        }]
      }
    }
    const isOpenSearch = false

    buildAccessMethods(collectionMetadata, isOpenSearch)

    expect(buildDownloadMock).toBeCalledTimes(1)
  })

  describe('when ordering is disabled', () => {
    test('calls buildEcho access method and no echo-order access method is returned', () => {
      const buildEsiEchoMock = jest.spyOn(buildEsiEcho, 'buildEsiEcho')
      buildEsiEchoMock.mockImplementationOnce(() => jest.fn())

      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableOrdering: 'true'
      }))

      const collectionMetadata = {
        services: {
          items: [{
            type: 'ECHO ORDERS',
            url: {
              urlValue: 'https://example.com'
            },
            maxItemsPerOrder: 2000,
            orderOptions: {
              items: [{
                conceptId: 'OO10000-EDSC',
                name: 'mock form',
                form: 'mock form'
              }]
            }
          }]
        }
      }
      const isOpenSearch = false

      buildAccessMethods(collectionMetadata, isOpenSearch)

      expect(buildEsiEchoMock).toBeCalledTimes(1)

      expect(buildEsiEchoMock).toHaveBeenCalledWith({
        maxItemsPerOrder: 2000,
        orderOptions: {
          items: [
            {
              conceptId: 'OO10000-EDSC',
              form: 'mock form',
              name: 'mock form'
            }
          ]
        },
        type: 'ECHO ORDERS',
        url: {
          urlValue: 'https://example.com'
        }
      }, 'true')
    })
  })

  test('calls buildEsiEcho access method with type ECHO ORDERS', () => {
    const buildEsiEchoMock = jest.spyOn(buildEsiEcho, 'buildEsiEcho')
    buildEsiEchoMock.mockImplementationOnce(() => jest.fn())

    const collectionMetadata = {
      services: {
        items: [{
          type: 'ECHO ORDERS',
          url: {
            urlValue: 'https://example.com'
          },
          maxItemsPerOrder: 2000,
          orderOptions: {
            items: [{
              conceptId: 'OO10000-EDSC',
              name: 'mock form',
              form: 'mock form'
            }]
          }
        }]
      }
    }
    const isOpenSearch = false

    buildAccessMethods(collectionMetadata, isOpenSearch)

    expect(buildEsiEchoMock).toBeCalledTimes(1)

    expect(buildEsiEchoMock).toHaveBeenCalledWith({
      maxItemsPerOrder: 2000,
      orderOptions: {
        items: [
          {
            conceptId: 'OO10000-EDSC',
            form: 'mock form',
            name: 'mock form'
          }
        ]
      },
      type: 'ECHO ORDERS',
      url: {
        urlValue: 'https://example.com'
      }
    }, 'false')
  })

  test('calls buildEsiEcho access method with type ESI', () => {
    const buildEsiEchoMock = jest.spyOn(buildEsiEcho, 'buildEsiEcho')
    buildEsiEchoMock.mockImplementationOnce(() => jest.fn())

    const collectionMetadata = {
      services: {
        items: [{
          type: 'ESI',
          url: {
            urlValue: 'https://example.com'
          },
          maxItemsPerOrder: 2000,
          orderOptions: {
            items: [{
              conceptId: 'OO10000-EDSC',
              name: 'mock form',
              form: 'mock form'
            }]
          }
        }]
      }
    }
    const isOpenSearch = false

    buildAccessMethods(collectionMetadata, isOpenSearch)

    expect(buildEsiEchoMock).toBeCalledTimes(1)

    expect(buildEsiEchoMock).toHaveBeenCalledWith({
      maxItemsPerOrder: 2000,
      orderOptions: {
        items: [
          {
            conceptId: 'OO10000-EDSC',
            form: 'mock form',
            name: 'mock form'
          }
        ]
      },
      type: 'ESI',
      url: {
        urlValue: 'https://example.com'
      }
    }, 'false')
  })

  test('calls buildHarmony access method', () => {
    const buildHarmonyMock = jest.spyOn(buildHarmony, 'buildHarmony')
    buildHarmonyMock.mockImplementationOnce(() => jest.fn())

    const collectionMetadata = {
      services: {
        items: [{
          conceptId: 'S100000-EDSC',
          longName: 'Mock Service Name',
          name: 'mock-name',
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example.com'
          },
          serviceOptions: {
            subset: {
              spatialSubset: {
                boundingBox: {
                  allowMultipleValues: false
                }
              },
              variableSubset: {
                allowMultipleValues: true
              }
            },
            aggregation: {
              concatenate: {
                concatenateDefault: true
              }
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            interpolationTypes: [
              'Bilinear Interpolation',
              'Nearest Neighbor'
            ],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }]
          },
          supportedOutputProjections: [{
            projectionName: 'Polar Stereographic'
          }, {
            projectionName: 'Geographic'
          }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: [
              'GEOTIFF',
              'PNG',
              'TIFF',
              'NETCDF-4'
            ]
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: [
              'GEOTIFF',
              'PNG',
              'TIFF',
              'NETCDF-4'
            ]
          }],
          variables: {
            count: 0,
            items: null
          }
        }]
      },
      variables: {
        count: 4,
        items: [{
          conceptId: 'V100000-EDSC',
          definition: 'Alpha channel value',
          longName: 'Alpha channel ',
          name: 'alpha_var',
          nativeId: 'mmt_variable_3972',
          scienceKeywords: null
        }, {
          conceptId: 'V100001-EDSC',
          definition: 'Blue channel value',
          longName: 'Blue channel',
          name: 'blue_var',
          nativeId: 'mmt_variable_3971',
          scienceKeywords: null
        }, {
          conceptId: 'V100002-EDSC',
          definition: 'Green channel value',
          longName: 'Green channel',
          name: 'green_var',
          nativeId: 'mmt_variable_3970',
          scienceKeywords: null
        }, {
          conceptId: 'V100003-EDSC',
          definition: 'Red channel value',
          longName: 'Red channel',
          name: 'red_var',
          nativeId: 'mmt_variable_3969',
          scienceKeywords: null
        }]
      }
    }
    const isOpenSearch = false

    buildAccessMethods(collectionMetadata, isOpenSearch)

    expect(buildHarmonyMock).toBeCalledTimes(1)
  })

  test('calls buildOpendap access method', () => {
    const buildOpendapMock = jest.spyOn(buildOpendap, 'buildOpendap')
    buildOpendapMock.mockImplementationOnce(() => jest.fn())

    const collectionMetadata = {
      services: {
        items: [{
          conceptId: 'S100000-EDSC',
          longName: 'Mock Service Name',
          name: 'mock-name',
          type: 'OPeNDAP',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example.com'
          },
          serviceOptions: {
            supportedInputProjections: [{
              projectionName: 'Geographic'
            }],
            supportedOutputProjections: [{
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'ASCII',
              supportedOutputFormats: [
                'ASCII',
                'BINARY',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'BINARY',
              supportedOutputFormats: [
                'ASCII',
                'BINARY',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'ASCII',
                'BINARY',
                'NETCDF-4'
              ]
            }],
            subset: {
              spatialSubset: {
                boundingBox: {
                  allowMultipleValues: false
                }
              },
              variableSubset: {
                allowMultipleValues: true
              }
            }
          },
          supportedOutputProjections: [{
            projectionName: 'Geographic'
          }],
          supportedReformattings: [{
            supportedInputFormat: 'ASCII',
            supportedOutputFormats: [
              'ASCII',
              'BINARY',
              'NETCDF-4'
            ]
          }, {
            supportedInputFormat: 'BINARY',
            supportedOutputFormats: [
              'ASCII',
              'BINARY',
              'NETCDF-4'
            ]
          }, {
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: [
              'ASCII',
              'BINARY',
              'NETCDF-4'
            ]
          }],
          orderOptions: {
            count: 0,
            items: null
          },
          variables: {
            count: 4,
            items: [{
              conceptId: 'V100000-EDSC',
              definition: 'analysed_sst in units of kelvin',
              longName: 'analysed_sst',
              name: 'analysed_sst',
              nativeId: 'e2eTestVarHiRes1',
              scienceKeywords: [{
                category: 'Earth Science',
                topic: 'Oceans',
                term: 'Ocean Temperature',
                variableLevel1: 'Sea Surface Temperature'
              }]
            }, {
              conceptId: 'V100001-EDSC',
              definition: 'analysis_error in units of kelvin',
              longName: 'analysis_error',
              name: 'analysis_error',
              nativeId: 'e2eTestVarHiRes2',
              scienceKeywords: [
                {
                  category: 'Earth Science',
                  topic: 'Oceans',
                  term: 'Ocean Temperature',
                  variableLevel1: 'Sea Surface Temperature'
                }
              ]
            }, {
              conceptId: 'V100002-EDSC',
              definition: 'mask in units of seconds since 1981-0',
              longName: 'mask',
              name: 'mask',
              nativeId: 'e2eTestVarHiRes4',
              scienceKeywords: [{
                category: 'Earth Science',
                topic: 'Oceans',
                term: 'Ocean Temperature',
                variableLevel1: 'Sea Surface Temperature'
              }]
            }, {
              conceptId: 'V100003-EDSC',
              definition: 'sea_ice_fraction in units of fraction (between 0 ',
              longName: 'sea_ice_fraction',
              name: 'sea_ice_fraction',
              nativeId: 'e2eTestVarHiRes3',
              scienceKeywords: [{
                category: 'Earth Science',
                topic: 'Oceans',
                term: 'Ocean Temperature',
                variableLevel1: 'Sea Surface Temperature'
              }]
            }]
          }
        }]
      }
    }
    const isOpenSearch = false

    buildAccessMethods(collectionMetadata, isOpenSearch)

    expect(buildOpendapMock).toBeCalledTimes(1)
  })

  test('calls buildSwodlr access method', () => {
    const buildSwodlrMock = jest.spyOn(buildSwodlr, 'buildSwodlr')
    buildSwodlrMock.mockImplementationOnce(() => jest.fn())

    const collectionMetadata = {
      services: {
        items: [
          {
            conceptId: 'S100000-EDSC',
            longName: 'Mock PODAAC SWOT On-Demand Level 2 Raster Generation (SWODLR)',
            name: 'Mock PODAAC_SWODLR',
            type: 'SWODLR',
            url: {
              description: 'Service top-level URL',
              urlValue: 'https://swodlr.podaac.earthdatacloud.nasa.gov'
            },
            serviceOptions: {
              supportedOutputProjections: [
                {
                  projectionName: 'Universal Transverse Mercator'
                },
                {
                  projectionName: 'WGS84 - World Geodetic System 1984'
                }
              ]
            },
            supportedOutputProjections: [
              {
                projectionName: 'Universal Transverse Mercator'
              },
              {
                projectionName: 'WGS84 - World Geodetic System 1984'
              }
            ],
            supportedReformattings: null,
            supportedInputProjections: null,
            orderOptions: {
              items: []
            },
            variables: {
              items: []
            }
          }
        ]
      }
    }
    const isOpenSearch = false

    buildAccessMethods(collectionMetadata, isOpenSearch)

    expect(buildSwodlrMock).toBeCalledTimes(1)
  })

  describe('when swodlr is disabled', () => {
    test('calls buildSwodlr but no swodlr access method is returned', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableSwodlr: 'true'
      }))

      const buildSwodlrMock = jest.spyOn(buildSwodlr, 'buildSwodlr')
      buildSwodlrMock.mockImplementationOnce(() => jest.fn())

      const collectionMetadata = {
        services: {
          items: [
            {
              conceptId: 'S100000-EDSC',
              longName: 'Mock PODAAC SWOT On-Demand Level 2 Raster Generation (SWODLR)',
              name: 'Mock PODAAC_SWODLR',
              type: 'SWODLR',
              url: {
                description: 'Service top-level URL',
                urlValue: 'https://swodlr.podaac.earthdatacloud.nasa.gov'
              },
              serviceOptions: {
                supportedOutputProjections: [
                  {
                    projectionName: 'Universal Transverse Mercator'
                  },
                  {
                    projectionName: 'WGS84 - World Geodetic System 1984'
                  }
                ]
              },
              supportedOutputProjections: [
                {
                  projectionName: 'Universal Transverse Mercator'
                },
                {
                  projectionName: 'WGS84 - World Geodetic System 1984'
                }
              ],
              supportedReformattings: null,
              supportedInputProjections: null,
              orderOptions: {
                items: []
              },
              variables: {
                items: []
              }
            }
          ]
        }
      }
      const isOpenSearch = false

      buildAccessMethods(collectionMetadata, isOpenSearch)

      expect(buildSwodlrMock).toBeCalledTimes(1)

      expect(buildSwodlrMock).toHaveBeenCalledWith({
        conceptId: 'S100000-EDSC',
        longName: 'Mock PODAAC SWOT On-Demand Level 2 Raster Generation (SWODLR)',
        name: 'Mock PODAAC_SWODLR',
        orderOptions: {
          items: []
        },
        serviceOptions: {
          supportedOutputProjections: [
            {
              projectionName: 'Universal Transverse Mercator'
            },
            {
              projectionName: 'WGS84 - World Geodetic System 1984'
            }
          ]
        },
        supportedInputProjections: null,
        supportedOutputProjections: [
          {
            projectionName: 'Universal Transverse Mercator'
          },
          {
            projectionName: 'WGS84 - World Geodetic System 1984'
          }
        ],
        supportedReformattings: null,
        type: 'SWODLR',
        url: {
          description: 'Service top-level URL',
          urlValue: 'https://swodlr.podaac.earthdatacloud.nasa.gov'
        },
        variables: {
          items: []
        }
      }, 'true')
    })
  })

  describe('when the collection contains both variables associated to its services and variables directly associated to the collection', () => {
    test('variables on the service are returned instead of variables directly associated to the collection and buildHarmony is called 3 times', () => {
      const buildHarmonyMock = jest.spyOn(buildHarmony, 'buildHarmony')
      buildHarmonyMock.mockImplementationOnce(() => jest.fn())

      const collectionMetadata = {
        services: {
          items: [{
            conceptId: 'S100000-EDSC',
            longName: 'Mock Service Name',
            name: 'mock-name',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }],
            variables: {
              count: 4,
              items: [{
                conceptId: 'V100000-EDSC',
                definition: 'Alpha channel value',
                longName: 'Alpha channel ',
                name: 'alpha_var',
                nativeId: 'mmt_variable_3972',
                scienceKeywords: null
              }, {
                conceptId: 'V100001-EDSC',
                definition: 'Blue channel value',
                longName: 'Blue channel',
                name: 'blue_var',
                nativeId: 'mmt_variable_3971',
                scienceKeywords: null
              }, {
                conceptId: 'V100002-EDSC',
                definition: 'Green channel value',
                longName: 'Green channel',
                name: 'green_var',
                nativeId: 'mmt_variable_3970',
                scienceKeywords: null
              }, {
                conceptId: 'V100003-EDSC',
                definition: 'Red channel value',
                longName: 'Red channel',
                name: 'red_var',
                nativeId: 'mmt_variable_3969',
                scienceKeywords: null
              }]
            }
          }, {
            conceptId: 'S100001-EDSC',
            longName: 'Mock Service Name 2',
            name: 'mock-name 2',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example2.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }],
            variables: {
              count: 4,
              items: [{
                conceptId: 'V100006-EDSC',
                definition: 'Alpha channel value',
                longName: 'Alpha channel ',
                name: 'alpha_var',
                nativeId: 'mmt_variable_3973',
                scienceKeywords: null
              }, {
                conceptId: 'V100007-EDSC',
                definition: 'Blue channel value',
                longName: 'Blue channel',
                name: 'blue_var',
                nativeId: 'mmt_variable_3974',
                scienceKeywords: null
              }, {
                conceptId: 'V100008-EDSC',
                definition: 'Green channel value',
                longName: 'Green channel',
                name: 'green_var',
                nativeId: 'mmt_variable_3975',
                scienceKeywords: null
              }, {
                conceptId: 'V100009-EDSC',
                definition: 'Red channel value',
                longName: 'Red channel',
                name: 'red_var',
                nativeId: 'mmt_variable_3966',
                scienceKeywords: null
              }]
            }
          },
          {
            conceptId: 'S100002-EDSC',
            longName: 'Mock Service Name 3',
            name: 'mock-name 3',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example3.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }]
          }]
        },
        variables: {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        }
      }
      const isOpenSearch = false

      buildAccessMethods(collectionMetadata, isOpenSearch)

      expect(buildHarmonyMock).toBeCalledTimes(3)

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        1,
        {
          conceptId: 'S100000-EDSC',
          longName: 'Mock Service Name',
          name: 'mock-name',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example.com'
          },
          variables: {
            count: 4,
            items: [{
              conceptId: 'V100000-EDSC',
              definition: 'Alpha channel value',
              longName: 'Alpha channel ',
              name: 'alpha_var',
              nativeId: 'mmt_variable_3972',
              scienceKeywords: null
            }, {
              conceptId: 'V100001-EDSC',
              definition: 'Blue channel value',
              longName: 'Blue channel',
              name: 'blue_var',
              nativeId: 'mmt_variable_3971',
              scienceKeywords: null
            }, {
              conceptId: 'V100002-EDSC',
              definition: 'Green channel value',
              longName: 'Green channel',
              name: 'green_var',
              nativeId: 'mmt_variable_3970',
              scienceKeywords: null
            }, {
              conceptId: 'V100003-EDSC',
              definition: 'Red channel value',
              longName: 'Red channel',
              name: 'red_var',
              nativeId: 'mmt_variable_3969',
              scienceKeywords: null
            }]
          }
        },
        {
          count: 4,
          items: [{
            conceptId: 'V100000-EDSC',
            definition: 'Alpha channel value',
            longName: 'Alpha channel ',
            name: 'alpha_var',
            nativeId: 'mmt_variable_3972',
            scienceKeywords: null
          }, {
            conceptId: 'V100001-EDSC',
            definition: 'Blue channel value',
            longName: 'Blue channel',
            name: 'blue_var',
            nativeId: 'mmt_variable_3971',
            scienceKeywords: null
          }, {
            conceptId: 'V100002-EDSC',
            definition: 'Green channel value',
            longName: 'Green channel',
            name: 'green_var',
            nativeId: 'mmt_variable_3970',
            scienceKeywords: null
          }, {
            conceptId: 'V100003-EDSC',
            definition: 'Red channel value',
            longName: 'Red channel',
            name: 'red_var',
            nativeId: 'mmt_variable_3969',
            scienceKeywords: null
          }]
        },
        0
      )

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        2,
        {
          conceptId: 'S100001-EDSC',
          longName: 'Mock Service Name 2',
          name: 'mock-name 2',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example2.com'
          },
          variables: {
            count: 4,
            items: [{
              conceptId: 'V100006-EDSC',
              definition: 'Alpha channel value',
              longName: 'Alpha channel ',
              name: 'alpha_var',
              nativeId: 'mmt_variable_3973',
              scienceKeywords: null
            }, {
              conceptId: 'V100007-EDSC',
              definition: 'Blue channel value',
              longName: 'Blue channel',
              name: 'blue_var',
              nativeId: 'mmt_variable_3974',
              scienceKeywords: null
            }, {
              conceptId: 'V100008-EDSC',
              definition: 'Green channel value',
              longName: 'Green channel',
              name: 'green_var',
              nativeId: 'mmt_variable_3975',
              scienceKeywords: null
            }, {
              conceptId: 'V100009-EDSC',
              definition: 'Red channel value',
              longName: 'Red channel',
              name: 'red_var',
              nativeId: 'mmt_variable_3966',
              scienceKeywords: null
            }]
          }
        },
        {
          count: 4,
          items: [{
            conceptId: 'V100006-EDSC',
            definition: 'Alpha channel value',
            longName: 'Alpha channel ',
            name: 'alpha_var',
            nativeId: 'mmt_variable_3973',
            scienceKeywords: null
          }, {
            conceptId: 'V100007-EDSC',
            definition: 'Blue channel value',
            longName: 'Blue channel',
            name: 'blue_var',
            nativeId: 'mmt_variable_3974',
            scienceKeywords: null
          }, {
            conceptId: 'V100008-EDSC',
            definition: 'Green channel value',
            longName: 'Green channel',
            name: 'green_var',
            nativeId: 'mmt_variable_3975',
            scienceKeywords: null
          }, {
            conceptId: 'V100009-EDSC',
            definition: 'Red channel value',
            longName: 'Red channel',
            name: 'red_var',
            nativeId: 'mmt_variable_3966',
            scienceKeywords: null
          }]
        },
        1
      )

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        3,
        {
          conceptId: 'S100002-EDSC',
          longName: 'Mock Service Name 3',
          name: 'mock-name 3',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example3.com'
          }
        },
        {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        },
        2
      )
    })
  })

  describe('when the collection contains variables directly associated to the collection and no variables associated to it services (empty)', () => {
    test('variables on the collection are returned instead of variables associated to the service and buildHarmony is called 3 times', () => {
      const buildHarmonyMock = jest.spyOn(buildHarmony, 'buildHarmony')
      buildHarmonyMock.mockImplementationOnce(() => jest.fn())

      const collectionMetadata = {
        services: {
          items: [{
            conceptId: 'S100000-EDSC',
            longName: 'Mock Service Name',
            name: 'mock-name',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }],
            variables: {
              count: 0,
              items: []
            }
          }, {
            conceptId: 'S100001-EDSC',
            longName: 'Mock Service Name 2',
            name: 'mock-name 2',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example2.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }],
            variables: {
              count: 4,
              items: []
            }
          },
          {
            conceptId: 'S100002-EDSC',
            longName: 'Mock Service Name 3',
            name: 'mock-name 3',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example3.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }]
          }]
        },
        variables: {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        }
      }
      const isOpenSearch = false

      buildAccessMethods(collectionMetadata, isOpenSearch)

      expect(buildHarmonyMock).toBeCalledTimes(3)

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        1,
        {
          conceptId: 'S100000-EDSC',
          longName: 'Mock Service Name',
          name: 'mock-name',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example.com'
          },
          variables: {
            count: 0,
            items: []
          }
        },
        {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        },
        0
      )

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        2,
        {
          conceptId: 'S100001-EDSC',
          longName: 'Mock Service Name 2',
          name: 'mock-name 2',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example2.com'
          },
          variables: {
            count: 4,
            items: []
          }
        },
        {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        },
        1
      )

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        3,
        {
          conceptId: 'S100002-EDSC',
          longName: 'Mock Service Name 3',
          name: 'mock-name 3',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example3.com'
          }
        },
        {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        },
        2
      )
    })
  })

  describe('when the collection contains variables directly associated to the collection and some variables associated to some services', () => {
    test('variables on the collection are returned for services without variables but, variables associated to the service are returned for services that have them and buildHarmony is called 3 times', () => {
      const buildHarmonyMock = jest.spyOn(buildHarmony, 'buildHarmony')
      buildHarmonyMock.mockImplementationOnce(() => jest.fn())

      const collectionMetadata = {
        services: {
          items: [{
            conceptId: 'S100000-EDSC',
            longName: 'Mock Service Name',
            name: 'mock-name',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }],
            variables: {
              count: 4,
              items: [{
                conceptId: 'V100000-EDSC',
                definition: 'Alpha channel value',
                longName: 'Alpha channel ',
                name: 'alpha_var',
                nativeId: 'mmt_variable_3972',
                scienceKeywords: null
              }, {
                conceptId: 'V100001-EDSC',
                definition: 'Blue channel value',
                longName: 'Blue channel',
                name: 'blue_var',
                nativeId: 'mmt_variable_3971',
                scienceKeywords: null
              }, {
                conceptId: 'V100002-EDSC',
                definition: 'Green channel value',
                longName: 'Green channel',
                name: 'green_var',
                nativeId: 'mmt_variable_3970',
                scienceKeywords: null
              }, {
                conceptId: 'V100003-EDSC',
                definition: 'Red channel value',
                longName: 'Red channel',
                name: 'red_var',
                nativeId: 'mmt_variable_3969',
                scienceKeywords: null
              }]
            }
          }, {
            conceptId: 'S100001-EDSC',
            longName: 'Mock Service Name 2',
            name: 'mock-name 2',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example2.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }]
          },
          {
            conceptId: 'S100002-EDSC',
            longName: 'Mock Service Name 3',
            name: 'mock-name 3',
            type: 'Harmony',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example3.com'
            },
            serviceOptions: {
              subset: {
                spatialSubset: {
                  boundingBox: {
                    allowMultipleValues: false
                  }
                },
                variableSubset: {
                  allowMultipleValues: true
                }
              },
              supportedOutputProjections: [{
                projectionName: 'Polar Stereographic'
              }, {
                projectionName: 'Geographic'
              }],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }]
            },
            supportedOutputProjections: [{
              projectionName: 'Polar Stereographic'
            }, {
              projectionName: 'Geographic'
            }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: [
                'GEOTIFF',
                'PNG',
                'TIFF',
                'NETCDF-4'
              ]
            }]
          }]
        },
        variables: {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        }
      }
      const isOpenSearch = false

      buildAccessMethods(collectionMetadata, isOpenSearch)

      expect(buildHarmonyMock).toBeCalledTimes(3)

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        1,
        {
          conceptId: 'S100000-EDSC',
          longName: 'Mock Service Name',
          name: 'mock-name',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example.com'
          },
          variables: {
            count: 4,
            items: [{
              conceptId: 'V100000-EDSC',
              definition: 'Alpha channel value',
              longName: 'Alpha channel ',
              name: 'alpha_var',
              nativeId: 'mmt_variable_3972',
              scienceKeywords: null
            },
            {
              conceptId: 'V100001-EDSC',
              definition: 'Blue channel value',
              longName: 'Blue channel',
              name: 'blue_var',
              nativeId: 'mmt_variable_3971',
              scienceKeywords: null
            }, {
              conceptId: 'V100002-EDSC',
              definition: 'Green channel value',
              longName: 'Green channel',
              name: 'green_var',
              nativeId: 'mmt_variable_3970',
              scienceKeywords: null
            }, {
              conceptId: 'V100003-EDSC',
              definition: 'Red channel value',
              longName: 'Red channel',
              name: 'red_var',
              nativeId: 'mmt_variable_3969',
              scienceKeywords: null
            }]
          }
        },
        {
          count: 4,
          items: [{
            conceptId: 'V100000-EDSC',
            definition: 'Alpha channel value',
            longName: 'Alpha channel ',
            name: 'alpha_var',
            nativeId: 'mmt_variable_3972',
            scienceKeywords: null
          },
          {
            conceptId: 'V100001-EDSC',
            definition: 'Blue channel value',
            longName: 'Blue channel',
            name: 'blue_var',
            nativeId: 'mmt_variable_3971',
            scienceKeywords: null
          }, {
            conceptId: 'V100002-EDSC',
            definition: 'Green channel value',
            longName: 'Green channel',
            name: 'green_var',
            nativeId: 'mmt_variable_3970',
            scienceKeywords: null
          }, {
            conceptId: 'V100003-EDSC',
            definition: 'Red channel value',
            longName: 'Red channel',
            name: 'red_var',
            nativeId: 'mmt_variable_3969',
            scienceKeywords: null
          }]
        },
        0
      )

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        2,
        {
          conceptId: 'S100001-EDSC',
          longName: 'Mock Service Name 2',
          name: 'mock-name 2',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example2.com'
          }
        },
        {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        },
        1
      )

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        3,
        {
          conceptId: 'S100002-EDSC',
          longName: 'Mock Service Name 3',
          name: 'mock-name 3',
          serviceOptions: {
            interpolationTypes: ['Bilinear Interpolation', 'Nearest Neighbor'],
            subset: {
              spatialSubset: { boundingBox: { allowMultipleValues: false } },
              variableSubset: { allowMultipleValues: true }
            },
            supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
            supportedReformattings: [{
              supportedInputFormat: 'NETCDF-4',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }, {
              supportedInputFormat: 'GEOTIFF',
              supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
            }]
          },
          supportedOutputProjections: [{ projectionName: 'Polar Stereographic' }, { projectionName: 'Geographic' }],
          supportedReformattings: [{
            supportedInputFormat: 'NETCDF-4',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }, {
            supportedInputFormat: 'GEOTIFF',
            supportedOutputFormats: ['GEOTIFF', 'PNG', 'TIFF', 'NETCDF-4']
          }],
          type: 'Harmony',
          url: {
            description: 'Mock URL',
            urlValue: 'https://example3.com'
          }
        },
        {
          count: 3,
          items: [{
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          }, {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          }, {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }]
        },
        2
      )
    })
  })
})
