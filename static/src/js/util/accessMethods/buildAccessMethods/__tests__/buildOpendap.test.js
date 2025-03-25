import { buildOpendap } from '../buildOpendap'

describe('buildOpendap', () => {
  test('returns an opendap access method', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            conceptId: 'S100000-EDSC',
            longName: 'Mock Service Name',
            name: 'mock-name',
            type: 'OPeNDAP',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example.com'
            },
            serviceOptions: {
              supportedInputProjections: [
                {
                  projectionName: 'Geographic'
                }
              ],
              supportedOutputProjections: [
                {
                  projectionName: 'Geographic'
                }
              ],
              supportedReformattings: [
                {
                  supportedInputFormat: 'ASCII',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'BINARY',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'NETCDF-4',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                }
              ],
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
            supportedOutputProjections: [
              {
                projectionName: 'Geographic'
              }
            ],
            supportedReformattings: [
              {
                supportedInputFormat: 'ASCII',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'BINARY',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              }
            ],
            orderOptions: {
              count: 0,
              items: null
            },
            variables: {
              count: 4,
              items: [
                {
                  conceptId: 'V100000-EDSC',
                  definition: 'analysed_sst in units of kelvin',
                  longName: 'analysed_sst',
                  name: 'analysed_sst',
                  nativeId: 'e2eTestVarHiRes1',
                  scienceKeywords: [
                    {
                      category: 'Earth Science',
                      topic: 'Oceans',
                      term: 'Ocean Temperature',
                      variableLevel1: 'Sea Surface Temperature'
                    }
                  ]
                },
                {
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
                },
                {
                  conceptId: 'V100002-EDSC',
                  definition: 'mask in units of seconds since 1981-0',
                  longName: 'mask',
                  name: 'mask',
                  nativeId: 'e2eTestVarHiRes4',
                  scienceKeywords: [
                    {
                      category: 'Earth Science',
                      topic: 'Oceans',
                      term: 'Ocean Temperature',
                      variableLevel1: 'Sea Surface Temperature'
                    }
                  ]
                },
                {
                  conceptId: 'V100003-EDSC',
                  definition: 'sea_ice_fraction in units of fraction (between 0 ',
                  longName: 'sea_ice_fraction',
                  name: 'sea_ice_fraction',
                  nativeId: 'e2eTestVarHiRes3',
                  scienceKeywords: [
                    {
                      category: 'Earth Science',
                      topic: 'Oceans',
                      term: 'Ocean Temperature',
                      variableLevel1: 'Sea Surface Temperature'
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    }

    const { services, variables: collectionAssociatedVariables = {} } = collectionMetadata
    const serviceItem = services.items[0]

    let associatedVariables = collectionAssociatedVariables

    const {
      variables: serviceAssociatedVariables = {}
    } = serviceItem

    if (serviceAssociatedVariables.items && serviceAssociatedVariables.items.length > 0) {
      associatedVariables = serviceAssociatedVariables
    }

    const params = {
      associatedVariables
    }

    const accessMethodsList = buildOpendap(serviceItem, params)

    expect(accessMethodsList.length).toEqual(1)

    expect(accessMethodsList).toEqual(
      [
        {
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
          keywordMappings: [
            {
              children: [
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
              label: 'Sea Surface Temperature'
            }
          ],
          longName: 'Mock Service Name',
          name: 'mock-name',
          supportedOutputFormats: [
            'ASCII',
            'BINARY',
            'NETCDF-4'
          ],
          supportsVariableSubsetting: true,
          type: 'OPeNDAP',
          variables: {
            'V100000-EDSC': {
              conceptId: 'V100000-EDSC',
              definition: 'analysed_sst in units of kelvin',
              longName: 'analysed_sst',
              name: 'analysed_sst',
              nativeId: 'e2eTestVarHiRes1',
              scienceKeywords: [
                {
                  category: 'Earth Science',
                  topic: 'Oceans',
                  term: 'Ocean Temperature',
                  variableLevel1: 'Sea Surface Temperature'
                }
              ]
            },
            'V100001-EDSC': {
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
            },
            'V100002-EDSC': {
              conceptId: 'V100002-EDSC',
              definition: 'mask in units of seconds since 1981-0',
              longName: 'mask',
              name: 'mask',
              nativeId: 'e2eTestVarHiRes4',
              scienceKeywords: [
                {
                  category: 'Earth Science',
                  topic: 'Oceans',
                  term: 'Ocean Temperature',
                  variableLevel1: 'Sea Surface Temperature'
                }
              ]
            },
            'V100003-EDSC': {
              conceptId: 'V100003-EDSC',
              definition: 'sea_ice_fraction in units of fraction (between 0 ',
              longName: 'sea_ice_fraction',
              name: 'sea_ice_fraction',
              nativeId: 'e2eTestVarHiRes3',
              scienceKeywords: [
                {
                  category: 'Earth Science',
                  topic: 'Oceans',
                  term: 'Ocean Temperature',
                  variableLevel1: 'Sea Surface Temperature'
                }
              ]
            }
          }
        }
      ]
    )
  })

  test('returns opendap variables correctly and does not use associatedVariables when it already has them in the item', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            conceptId: 'S100000-EDSC',
            longName: 'Mock Service Name',
            name: 'mock-name',
            type: 'OPeNDAP',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example.com'
            },
            serviceOptions: {
              supportedInputProjections: [
                {
                  projectionName: 'Geographic'
                }
              ],
              supportedOutputProjections: [
                {
                  projectionName: 'Geographic'
                }
              ],
              supportedReformattings: [
                {
                  supportedInputFormat: 'ASCII',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'BINARY',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'NETCDF-4',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                }
              ],
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
            supportedOutputProjections: [
              {
                projectionName: 'Geographic'
              }
            ],
            supportedReformattings: [
              {
                supportedInputFormat: 'ASCII',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'BINARY',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              }
            ],
            orderOptions: {
              count: 0,
              items: null
            },
            variables: {
              count: 4,
              items: [
                {
                  conceptId: 'V100000-EDSC',
                  definition: 'analysed_sst in units of kelvin',
                  longName: 'analysed_sst',
                  name: 'analysed_sst',
                  nativeId: 'e2eTestVarHiRes1',
                  scienceKeywords: [
                    {
                      category: 'Earth Science',
                      topic: 'Oceans',
                      term: 'Ocean Temperature',
                      variableLevel1: 'Sea Surface Temperature'
                    }
                  ]
                },
                {
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
                },
                {
                  conceptId: 'V100002-EDSC',
                  definition: 'mask in units of seconds since 1981-0',
                  longName: 'mask',
                  name: 'mask',
                  nativeId: 'e2eTestVarHiRes4',
                  scienceKeywords: [
                    {
                      category: 'Earth Science',
                      topic: 'Oceans',
                      term: 'Ocean Temperature',
                      variableLevel1: 'Sea Surface Temperature'
                    }
                  ]
                },
                {
                  conceptId: 'V100003-EDSC',
                  definition: 'sea_ice_fraction in units of fraction (between 0 ',
                  longName: 'sea_ice_fraction',
                  name: 'sea_ice_fraction',
                  nativeId: 'e2eTestVarHiRes3',
                  scienceKeywords: [
                    {
                      category: 'Earth Science',
                      topic: 'Oceans',
                      term: 'Ocean Temperature',
                      variableLevel1: 'Sea Surface Temperature'
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      variables: {
        count: 4,
        items: [
          {
            conceptId: 'V100004-EDSC',
            definition: 'Alpha channel value',
            longName: 'Alpha channel ',
            name: 'alpha_var',
            nativeId: 'mmt_variable_3972',
            scienceKeywords: null
          },
          {
            conceptId: 'V100005-EDSC',
            definition: 'Blue channel value',
            longName: 'Blue channel',
            name: 'blue_var',
            nativeId: 'mmt_variable_3971',
            scienceKeywords: null
          },
          {
            conceptId: 'V100006-EDSC',
            definition: 'Green channel value',
            longName: 'Green channel',
            name: 'green_var',
            nativeId: 'mmt_variable_3970',
            scienceKeywords: null
          },
          {
            conceptId: 'V100007-EDSC',
            definition: 'Red channel value',
            longName: 'Red Channel',
            name: 'red_var',
            nativeId: 'mmt_variable_3969',
            scienceKeywords: null
          }
        ]
      }
    }

    const { services, variables: collectionAssociatedVariables = {} } = collectionMetadata
    const serviceItem = services.items[0]

    let associatedVariables = collectionAssociatedVariables

    const {
      variables: serviceAssociatedVariables = {}
    } = serviceItem

    if (serviceAssociatedVariables.items && serviceAssociatedVariables.items.length > 0) {
      associatedVariables = serviceAssociatedVariables
    }

    const params = {
      associatedVariables
    }

    const accessMethodsList = buildOpendap(serviceItem, params)

    expect(accessMethodsList.length).toEqual(1)

    expect(accessMethodsList).toEqual(
      [
        {
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
          keywordMappings: [
            {
              children: [
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
              label: 'Sea Surface Temperature'
            }
          ],
          longName: 'Mock Service Name',
          name: 'mock-name',
          supportedOutputFormats: [
            'ASCII',
            'BINARY',
            'NETCDF-4'
          ],
          supportsVariableSubsetting: true,
          type: 'OPeNDAP',
          variables: {
            'V100000-EDSC': {
              conceptId: 'V100000-EDSC',
              definition: 'analysed_sst in units of kelvin',
              longName: 'analysed_sst',
              name: 'analysed_sst',
              nativeId: 'e2eTestVarHiRes1',
              scienceKeywords: [
                {
                  category: 'Earth Science',
                  topic: 'Oceans',
                  term: 'Ocean Temperature',
                  variableLevel1: 'Sea Surface Temperature'
                }
              ]
            },
            'V100001-EDSC': {
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
            },
            'V100002-EDSC': {
              conceptId: 'V100002-EDSC',
              definition: 'mask in units of seconds since 1981-0',
              longName: 'mask',
              name: 'mask',
              nativeId: 'e2eTestVarHiRes4',
              scienceKeywords: [
                {
                  category: 'Earth Science',
                  topic: 'Oceans',
                  term: 'Ocean Temperature',
                  variableLevel1: 'Sea Surface Temperature'
                }
              ]
            },
            'V100003-EDSC': {
              conceptId: 'V100003-EDSC',
              definition: 'sea_ice_fraction in units of fraction (between 0 ',
              longName: 'sea_ice_fraction',
              name: 'sea_ice_fraction',
              nativeId: 'e2eTestVarHiRes3',
              scienceKeywords: [
                {
                  category: 'Earth Science',
                  topic: 'Oceans',
                  term: 'Ocean Temperature',
                  variableLevel1: 'Sea Surface Temperature'
                }
              ]
            }
          }
        }
      ]
    )
  })

  test('returns an correct variables when using collection associated variables', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            conceptId: 'S100000-EDSC',
            longName: 'Mock Service Name',
            name: 'mock-name',
            type: 'OPeNDAP',
            url: {
              description: 'Mock URL',
              urlValue: 'https://example.com'
            },
            serviceOptions: {
              supportedInputProjections: [
                {
                  projectionName: 'Geographic'
                }
              ],
              supportedOutputProjections: [
                {
                  projectionName: 'Geographic'
                }
              ],
              supportedReformattings: [
                {
                  supportedInputFormat: 'ASCII',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'BINARY',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                },
                {
                  supportedInputFormat: 'NETCDF-4',
                  supportedOutputFormats: [
                    'ASCII',
                    'BINARY',
                    'NETCDF-4'
                  ]
                }
              ],
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
            supportedOutputProjections: [
              {
                projectionName: 'Geographic'
              }
            ],
            supportedReformattings: [
              {
                supportedInputFormat: 'ASCII',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'BINARY',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              },
              {
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: [
                  'ASCII',
                  'BINARY',
                  'NETCDF-4'
                ]
              }
            ],
            orderOptions: {
              count: 0,
              items: null
            },
            variables: {
              count: 0,
              items: []
            }
          }
        ]
      },
      variables: {
        count: 3,
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
          }
        ]
      }
    }

    const { services, variables: collectionAssociatedVariables = {} } = collectionMetadata
    const serviceItem = services.items[0]

    let associatedVariables = collectionAssociatedVariables

    const {
      variables: serviceAssociatedVariables = {}
    } = serviceItem

    if (serviceAssociatedVariables.items && serviceAssociatedVariables.items.length > 0) {
      associatedVariables = serviceAssociatedVariables
    }

    const params = {
      associatedVariables
    }

    const accessMethodsList = buildOpendap(serviceItem, params)

    expect(accessMethodsList.length).toEqual(1)

    expect(accessMethodsList).toEqual(
      [
        {
          hierarchyMappings: [
            {
              id: 'V100000-EDSC'
            },
            {
              id: 'V100001-EDSC'
            },
            {
              id: 'V100002-EDSC'
            }
          ],
          id: 'S100000-EDSC',
          isValid: true,
          keywordMappings: [],
          longName: 'Mock Service Name',
          name: 'mock-name',
          supportedOutputFormats: [
            'ASCII',
            'BINARY',
            'NETCDF-4'
          ],
          supportsVariableSubsetting: true,
          type: 'OPeNDAP',
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
            }
          }
        }
      ]
    )
  })
})
