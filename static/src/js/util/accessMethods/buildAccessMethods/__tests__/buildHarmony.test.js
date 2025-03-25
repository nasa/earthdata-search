import { buildHarmony } from '../buildHarmony'

describe('buildHarmony', () => {
  test('returns a harmony access method', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            description: 'abc123',
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
              supportedOutputProjections: [
                {
                  projectionName: 'Polar Stereographic'
                },
                {
                  projectionName: 'Geographic'
                }
              ],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [
                {
                  supportedInputFormat: 'NETCDF-4',
                  supportedOutputFormats: [
                    'GEOTIFF',
                    'PNG',
                    'TIFF',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'GEOTIFF',
                  supportedOutputFormats: [
                    'GEOTIFF',
                    'PNG',
                    'TIFF',
                    'NETCDF-4'
                  ]
                }
              ]
            },
            supportedOutputProjections: [
              {
                projectionName: 'Polar Stereographic'
              },
              {
                projectionName: 'Geographic'
              }
            ],
            supportedReformattings: [
              {
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }
            ],
            variables: {
              count: 0,
              items: null
            }
          }
        ]
      },
      variables: {
        count: 4,
        items: [
          {
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
          },
          {
            conceptId: 'V100002-EDSC',
            definition: 'Green channel value',
            longName: 'Green channel',
            name: 'green_var',
            nativeId: 'mmt_variable_3970',
            scienceKeywords: null
          },
          {
            conceptId: 'V100003-EDSC',
            definition: 'Red channel value',
            longName: 'Red Channel',
            name: 'red_var',
            nativeId: 'mmt_variable_3969',
            scienceKeywords: null
          }
        ]
      }
    }

    const { services, variables: associatedVariables } = collectionMetadata
    const serviceItem = services.items[0]

    const harmonyIndex = 0

    const params = {
      associatedVariables,
      harmonyIndex
    }

    const accessMethodsList = buildHarmony(serviceItem, params)

    expect(accessMethodsList).toEqual([
      {
        description: 'abc123',
        enableTemporalSubsetting: true,
        enableSpatialSubsetting: true,
        hierarchyMappings: [
          {
            id: 'V100000-EDSC'
          },
          {
            id: 'V100001-EDSC'
          },
          {
            id: 'V100002-EDSC'
          },
          {
            id: 'V100003-EDSC'
          }
        ],
        id: 'S100000-EDSC',
        isValid: true,
        keywordMappings: [],
        longName: 'Mock Service Name',
        name: 'mock-name',
        supportedOutputFormats: [
          'GEOTIFF',
          'PNG',
          'TIFF',
          'NETCDF-4'
        ],
        supportedOutputProjections: [],
        supportsBoundingBoxSubsetting: true,
        supportsShapefileSubsetting: false,
        supportsTemporalSubsetting: false,
        supportsVariableSubsetting: true,
        supportsConcatenation: true,
        defaultConcatenation: true,
        enableConcatenateDownload: true,
        type: 'Harmony',
        url: 'https://example.com',
        variables: {
          'V100000-EDSC': {
            conceptId: 'V100000-EDSC',
            definition: 'Alpha channel value',
            longName: 'Alpha channel ',
            name: 'alpha_var',
            nativeId: 'mmt_variable_3972',
            scienceKeywords: null
          },
          'V100001-EDSC': {
            conceptId: 'V100001-EDSC',
            definition: 'Blue channel value',
            longName: 'Blue channel',
            name: 'blue_var',
            nativeId: 'mmt_variable_3971',
            scienceKeywords: null
          },
          'V100002-EDSC': {
            conceptId: 'V100002-EDSC',
            definition: 'Green channel value',
            longName: 'Green channel',
            name: 'green_var',
            nativeId: 'mmt_variable_3970',
            scienceKeywords: null
          },
          'V100003-EDSC': {
            conceptId: 'V100003-EDSC',
            definition: 'Red channel value',
            longName: 'Red Channel',
            name: 'red_var',
            nativeId: 'mmt_variable_3969',
            scienceKeywords: null
          }
        }
      }
    ])
  })

  test('correctly builds multiple harmony items', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            conceptId: 'S100000-EDSC',
            longName: 'Mock Service Name',
            name: 'mock-name',
            description: 'Mock Name',
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
              supportedOutputProjections: [
                {
                  projectionName: 'Polar Stereographic'
                },
                {
                  projectionName: 'Geographic'
                }
              ],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [
                {
                  supportedInputFormat: 'NETCDF-4',
                  supportedOutputFormats: [
                    'GEOTIFF',
                    'PNG',
                    'TIFF',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'GEOTIFF',
                  supportedOutputFormats: [
                    'GEOTIFF',
                    'PNG',
                    'TIFF',
                    'NETCDF-4'
                  ]
                }
              ]
            },
            supportedOutputProjections: [
              {
                projectionName: 'Polar Stereographic',
                projectionAuthority: 'Polar Stereographic'
              },
              {
                projectionName: 'Geographic',
                projectionAuthority: 'Geographic'
              }
            ],
            supportedReformattings: [
              {
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }
            ],
            variables: {
              count: 4,
              items: [
                {
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
                },
                {
                  conceptId: 'V100002-EDSC',
                  definition: 'Green channel value',
                  longName: 'Green channel',
                  name: 'green_var',
                  nativeId: 'mmt_variable_3970',
                  scienceKeywords: null
                },
                {
                  conceptId: 'V100003-EDSC',
                  definition: 'Red channel value',
                  longName: 'Red Channel',
                  name: 'red_var',
                  nativeId: 'mmt_variable_3969',
                  scienceKeywords: null
                }
              ]
            }
          },
          {
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
              supportedOutputProjections: [
                {
                  projectionName: 'Polar Stereographic'
                },
                {
                  projectionName: 'Geographic'
                }
              ],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [
                {
                  supportedInputFormat: 'NETCDF-4',
                  supportedOutputFormats: [
                    'GEOTIFF',
                    'PNG',
                    'TIFF',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'GEOTIFF',
                  supportedOutputFormats: [
                    'GEOTIFF',
                    'PNG',
                    'TIFF',
                    'NETCDF-4'
                  ]
                }
              ]
            },
            supportedOutputProjections: [
              {
                projectionName: 'Polar Stereographic'
              },
              {
                projectionName: 'Geographic'
              }
            ],
            supportedReformattings: [
              {
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }
            ],
            variables: {
              count: 4,
              items: [
                {
                  conceptId: 'V100006-EDSC',
                  definition: 'Alpha channel value',
                  longName: 'Alpha channel ',
                  name: 'alpha_var',
                  nativeId: 'mmt_variable_3973',
                  scienceKeywords: null
                },
                {
                  conceptId: 'V100007-EDSC',
                  definition: 'Blue channel value',
                  longName: 'Blue channel',
                  name: 'blue_var',
                  nativeId: 'mmt_variable_3974',
                  scienceKeywords: null
                },
                {
                  conceptId: 'V100008-EDSC',
                  definition: 'Green channel value',
                  longName: 'Green channel',
                  name: 'green_var',
                  nativeId: 'mmt_variable_3975',
                  scienceKeywords: null
                },
                {
                  conceptId: 'V100009-EDSC',
                  definition: 'Red channel value',
                  longName: 'Red Channel',
                  name: 'red_var',
                  nativeId: 'mmt_variable_3966',
                  scienceKeywords: null
                }
              ]
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
              supportedOutputProjections: [
                {
                  projectionName: 'Polar Stereographic'
                },
                {
                  projectionName: 'Geographic'
                }
              ],
              interpolationTypes: [
                'Bilinear Interpolation',
                'Nearest Neighbor'
              ],
              supportedReformattings: [
                {
                  supportedInputFormat: 'NETCDF-4',
                  supportedOutputFormats: [
                    'GEOTIFF',
                    'PNG',
                    'TIFF',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'GEOTIFF',
                  supportedOutputFormats: [
                    'GEOTIFF',
                    'PNG',
                    'TIFF',
                    'NETCDF-4'
                  ]
                }
              ]
            },
            supportedOutputProjections: [
              {
                projectionName: 'Polar Stereographic'
              },
              {
                projectionName: 'Geographic'
              }
            ],
            supportedReformattings: [
              {
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: [
                  'GEOTIFF',
                  'PNG',
                  'TIFF',
                  'NETCDF-4'
                ]
              }
            ]
          }]
      },
      variables: {
        count: 3,
        items: [
          {
            conceptId: 'V100003-EDSC',
            definition: 'Beta channel value',
            longName: 'Beta channel ',
            name: 'beta_var',
            nativeId: 'mmt_variable_4972',
            scienceKeywords: null
          },
          {
            conceptId: 'V100004-EDSC',
            definition: 'Orange channel value',
            longName: 'Orange channel',
            name: 'orange_var',
            nativeId: 'mmt_variable_4971',
            scienceKeywords: null
          },
          {
            conceptId: 'V100005-EDSC',
            definition: 'Purple channel value',
            longName: 'Purple channel',
            name: 'purple_var',
            nativeId: 'mmt_variable_4970',
            scienceKeywords: null
          }
        ]
      }
    }

    const { services, variables: collectionAssociatedVariables = {} } = collectionMetadata
    const { items: serviceItems = null } = services

    let harmonyIndex = 0

    const accessMethodsList = []

    serviceItems.forEach((serviceItem) => {
      let associatedVariables = collectionAssociatedVariables

      const {
        variables: serviceAssociatedVariables = {}
      } = serviceItem

      if (serviceAssociatedVariables.items && serviceAssociatedVariables.items.length > 0) {
        associatedVariables = serviceAssociatedVariables
      }

      const params = {
        associatedVariables,
        harmonyIndex
      }

      const harmonyResult = buildHarmony(serviceItem, params)

      accessMethodsList.push(harmonyResult)

      harmonyIndex += 1
    })

    expect(accessMethodsList.length).toEqual(3)

    expect(accessMethodsList).toEqual(
      [
        [
          {
            defaultConcatenation: false,
            enableConcatenateDownload: false,
            enableTemporalSubsetting: true,
            enableSpatialSubsetting: true,
            description: 'Mock Name',
            hierarchyMappings: [
              {
                id: 'V100000-EDSC'
              },
              {
                id: 'V100001-EDSC'
              },
              {
                id: 'V100002-EDSC'
              },
              {
                id: 'V100003-EDSC'
              }
            ],
            id: 'S100000-EDSC',
            isValid: true,
            keywordMappings: [],
            longName: 'Mock Service Name',
            name: 'mock-name',
            supportedOutputFormats: [
              'GEOTIFF',
              'PNG',
              'TIFF',
              'NETCDF-4'
            ],
            supportedOutputProjections: [
              'Polar Stereographic',
              'Geographic'
            ],
            supportsBoundingBoxSubsetting: true,
            supportsConcatenation: false,
            supportsShapefileSubsetting: false,
            supportsTemporalSubsetting: false,
            supportsVariableSubsetting: true,
            type: 'Harmony',
            url: 'https://example.com',
            variables: {
              'V100000-EDSC': {
                conceptId: 'V100000-EDSC',
                definition: 'Alpha channel value',
                longName: 'Alpha channel ',
                name: 'alpha_var',
                nativeId: 'mmt_variable_3972',
                scienceKeywords: null
              },
              'V100001-EDSC': {
                conceptId: 'V100001-EDSC',
                definition: 'Blue channel value',
                longName: 'Blue channel',
                name: 'blue_var',
                nativeId: 'mmt_variable_3971',
                scienceKeywords: null
              },
              'V100002-EDSC': {
                conceptId: 'V100002-EDSC',
                definition: 'Green channel value',
                longName: 'Green channel',
                name: 'green_var',
                nativeId: 'mmt_variable_3970',
                scienceKeywords: null
              },
              'V100003-EDSC': {
                conceptId: 'V100003-EDSC',
                definition: 'Red channel value',
                longName: 'Red Channel',
                name: 'red_var',
                nativeId: 'mmt_variable_3969',
                scienceKeywords: null
              }
            }
          }
        ],
        [
          {
            defaultConcatenation: false,
            enableConcatenateDownload: false,
            enableTemporalSubsetting: true,
            enableSpatialSubsetting: true,
            hierarchyMappings: [
              {
                id: 'V100006-EDSC'
              },
              {
                id: 'V100007-EDSC'
              },
              {
                id: 'V100008-EDSC'
              },
              {
                id: 'V100009-EDSC'
              }
            ],
            id: 'S100001-EDSC',
            isValid: true,
            keywordMappings: [],
            longName: 'Mock Service Name 2',
            name: 'mock-name 2',
            supportedOutputFormats: [
              'GEOTIFF',
              'PNG',
              'TIFF',
              'NETCDF-4'
            ],
            supportedOutputProjections: [],
            supportsBoundingBoxSubsetting: true,
            supportsConcatenation: false,
            supportsShapefileSubsetting: false,
            supportsTemporalSubsetting: false,
            supportsVariableSubsetting: true,
            type: 'Harmony',
            url: 'https://example2.com',
            variables: {
              'V100006-EDSC': {
                conceptId: 'V100006-EDSC',
                definition: 'Alpha channel value',
                longName: 'Alpha channel ',
                name: 'alpha_var',
                nativeId: 'mmt_variable_3973',
                scienceKeywords: null
              },
              'V100007-EDSC': {
                conceptId: 'V100007-EDSC',
                definition: 'Blue channel value',
                longName: 'Blue channel',
                name: 'blue_var',
                nativeId: 'mmt_variable_3974',
                scienceKeywords: null
              },
              'V100008-EDSC': {
                conceptId: 'V100008-EDSC',
                definition: 'Green channel value',
                longName: 'Green channel',
                name: 'green_var',
                nativeId: 'mmt_variable_3975',
                scienceKeywords: null
              },
              'V100009-EDSC': {
                conceptId: 'V100009-EDSC',
                definition: 'Red channel value',
                longName: 'Red Channel',
                name: 'red_var',
                nativeId: 'mmt_variable_3966',
                scienceKeywords: null
              }
            }
          }
        ],
        // Harmony2 contains the default variables in the coll -> var association
        [
          {
            defaultConcatenation: false,
            enableConcatenateDownload: false,
            enableTemporalSubsetting: true,
            enableSpatialSubsetting: true,
            hierarchyMappings: [
              {
                id: 'V100003-EDSC'
              },
              {
                id: 'V100004-EDSC'
              },
              {
                id: 'V100005-EDSC'
              }
            ],
            id: 'S100002-EDSC',
            isValid: true,
            keywordMappings: [],
            longName: 'Mock Service Name 3',
            name: 'mock-name 3',
            supportedOutputFormats: [
              'GEOTIFF',
              'PNG',
              'TIFF',
              'NETCDF-4'
            ],
            supportedOutputProjections: [],
            supportsBoundingBoxSubsetting: true,
            supportsConcatenation: false,
            supportsShapefileSubsetting: false,
            supportsTemporalSubsetting: false,
            supportsVariableSubsetting: true,
            type: 'Harmony',
            url: 'https://example3.com',
            variables: {
              'V100003-EDSC': {
                conceptId: 'V100003-EDSC',
                definition: 'Beta channel value',
                longName: 'Beta channel ',
                name: 'beta_var',
                nativeId: 'mmt_variable_4972',
                scienceKeywords: null
              },
              'V100004-EDSC': {
                conceptId: 'V100004-EDSC',
                definition: 'Orange channel value',
                longName: 'Orange channel',
                name: 'orange_var',
                nativeId: 'mmt_variable_4971',
                scienceKeywords: null
              },
              'V100005-EDSC': {
                conceptId: 'V100005-EDSC',
                definition: 'Purple channel value',
                longName: 'Purple channel',
                name: 'purple_var',
                nativeId: 'mmt_variable_4970',
                scienceKeywords: null
              }
            }
          }
        ]
      ]
    )
  })
})
