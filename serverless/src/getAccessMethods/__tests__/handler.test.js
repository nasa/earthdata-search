import knex from 'knex'
import mockKnex from 'mock-knex'

import getAccessMethods from '../handler'
import * as getJwtToken from '../../util/getJwtToken'
import * as getOptionDefinitions from '../getOptionDefinitions'
import * as getServiceOptionDefinitions from '../getServiceOptionDefinitions'
import * as getVariables from '../getVariables'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    dbConnectionToMock = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbConnectionToMock)

    return dbConnectionToMock
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('getAccessMethods', () => {
  test('populates a download method', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId',
          granules: {
            count: 1,
            items: [{
              conceptId: 'G100000-EDSC',
              onlineAccessFlag: true
            }]
          },
          services: {
            count: 0,
            items: null
          }
        }
      })
    }

    const result = await getAccessMethods(event, {})

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          download: {
            isValid: true,
            type: 'download'
          }
        },
        selectedAccessMethod: 'download'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('populates a harmony method', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId',
          services: {
            count: 1,
            items: [{
              conceptId: 'umm-s-record-1',
              type: 'Harmony',
              serviceOptions: {},
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: ['GEOTIFF', 'PNG', 'GIF']
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: ['GEOTIFF', 'PNG', 'GIF']
              }],
              supportedOutputProjections: [{
                projectionAuthority: 'EPSG:4326'
              }],
              url: {
                urlValue: 'https://harmony.earthdata.nas.gov'
              }
            }]
          },
          variables: {
            count: 0,
            items: null
          }
        }
      })
    }

    const result = await getAccessMethods(event, {})

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          harmony0: {
            enableTemporalSubsetting: true,
            hierarchyMappings: [],
            id: 'umm-s-record-1',
            isValid: true,
            keywordMappings: [],
            supportedOutputFormats: [
              'GEOTIFF',
              'PNG',
              'GIF'
            ],
            supportedOutputProjections: [
              'EPSG:4326'
            ],
            supportsBoundingBoxSubsetting: false,
            supportsShapefileSubsetting: false,
            supportsTemporalSubsetting: false,
            supportsVariableSubsetting: false,
            type: 'Harmony',
            url: 'https://harmony.earthdata.nas.gov',
            variables: {}
          }
        },
        selectedAccessMethod: 'harmony0'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('sets enableTemporalSubsetting to true for harmony access methods', async () => {
    dbTracker.on('query', (query) => {
      query.response([])
    })

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId',
          services: {
            count: 1,
            items: [{
              conceptId: 'umm-s-record-1',
              type: 'Harmony',
              serviceOptions: {},
              supportedReformattings: [{
                supportedInputFormat: 'NETCDF-4',
                supportedOutputFormats: ['GEOTIFF', 'PNG', 'GIF']
              }, {
                supportedInputFormat: 'GEOTIFF',
                supportedOutputFormats: ['GEOTIFF', 'PNG', 'GIF']
              }],
              supportedOutputProjections: [{
                projectionAuthority: 'EPSG:4326'
              }],
              url: {
                urlValue: 'https://harmony.earthdata.nas.gov'
              }
            }]
          },
          variables: {
            count: 0,
            items: null
          }
        }
      })
    }

    const result = await getAccessMethods(event, {})
    const { body } = result
    const { accessMethods } = JSON.parse(body)
    const { harmony0: harmonyAccessMethod } = accessMethods
    const { enableTemporalSubsetting } = harmonyAccessMethod

    expect(enableTemporalSubsetting).toBe(true)
  })

  test('populates a echoOrder method', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(undefined)
      } else if (step === 2) {
        query.response({
          urs_profile: {
            email_address: 'test@edsc.com'
          }
        })
      }
    })

    jest.spyOn(getOptionDefinitions, 'getOptionDefinitions').mockImplementation(() => [
      {
        echoOrder0: {
          form: 'mock echo form',
          option_definition: {
            id: 'option_def_guid',
            name: 'Option Definition'
          },
          option_definitions: undefined
        }
      }
    ])

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId',
          services: {
            count: 1,
            items: [{
              conceptId: 'umm-s-record-1',
              type: 'ECHO ORDERS',
              url: {
                description: 'EOSDIS ECHO ORDERS Service Implementation',
                urlValue: 'http://echo-order-endpoint.com'
              }
            }]
          },
          tags: {
            'edsc.extra.serverless.subset_service.echo_orders': {
              data: {
                id: 'umm-s-record-1',
                option_definitions: [{
                  id: 'option_def_guid',
                  name: 'Option Definition'
                }],
                type: 'ECHO ORDERS'
              }
            }
          }
        }
      })
    }

    const result = await getAccessMethods(event, {})

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          echoOrder0: {
            type: 'ECHO ORDERS',
            url: 'http://echo-order-endpoint.com',
            form: 'mock echo form',
            option_definition: {
              id: 'option_def_guid',
              name: 'Option Definition'
            },
            option_definitions: undefined
          }
        },
        selectedAccessMethod: 'echoOrder0'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('populates a esi method', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(undefined)
      } else if (step === 2) {
        query.response({
          urs_profile: {
            email_address: 'test@edsc.com'
          }
        })
      }
    })

    jest.spyOn(getServiceOptionDefinitions, 'getServiceOptionDefinitions').mockImplementation(() => [
      {
        esi0: {
          form: 'mock echo form',
          service_option_definition: {
            id: 'service_option_def_guid',
            name: 'Service Option Definition'
          },
          service_option_definitions: undefined
        }
      }
    ])

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId',
          services: {
            count: 1,
            items: [{
              conceptId: 'umm-s-record-1',
              type: 'ESI',
              url: {
                description: 'EOSDIS ESI Service Implementation',
                urlValue: 'http://esi-endpoint.com'
              }
            }]
          },
          tags: {
            'edsc.extra.serverless.subset_service.esi': {
              data: {
                id: 'umm-s-record-1',
                service_option_definitions: [{
                  id: 'service_option_def_guid',
                  name: 'Option Option'
                }],
                type: 'ESI'
              }
            }
          }
        }
      })
    }

    const result = await getAccessMethods(event, {})

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          esi0: {
            type: 'ESI',
            url: 'http://esi-endpoint.com',
            form: 'mock echo form',
            service_option_definition: {
              id: 'service_option_def_guid',
              name: 'Service Option Definition'
            },
            service_option_definitions: undefined
          }
        },
        selectedAccessMethod: 'esi0'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('populates a esi form with the authenticated users email address', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(undefined)
      } else if (step === 2) {
        query.response({
          urs_profile: {
            email_address: 'test@edsc.com'
          }
        })
      }
    })

    jest.spyOn(getServiceOptionDefinitions, 'getServiceOptionDefinitions').mockImplementation(() => [
      {
        esi0: {
          form: '<?xml version="1.0" encoding="UTF-8"?><form xmlns="http://echo.nasa.gov/v9/echoforms" xmlns:forms="http://echo.nasa.gov/v9/echoforms" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="http://ecs.nasa.gov/options" xsi:schemaLocation="http://echo.nasa.gov/v9/echoforms http://api.echo.nasa.gov/echo/wsdl/EchoForms.xsd"><!-- ECHO Service/Order form for DataSet "MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V006" (MOD13Q1.6): --><model><instance><ecs:request xmlns:ecs="http://ecs.nasa.gov/options"><!--NOTE: elements in caps losely match the ESI API, those in lowercase are helper elements --><ecs:requestInfo><ecs:email/></ecs:requestInfo><!--Dataset ID will be injected by Reverb--><ecs:CLIENT>ESI</ecs:CLIENT><!--First SubsetAgent in the input capabilities XML is used as the default.--><ecs:SUBAGENT_ID><ecs:value>HEG</ecs:value></ecs:SUBAGENT_ID></ecs:request></instance></model></form>',
          service_option_definition: {
            id: 'service_option_def_guid',
            name: 'Service Option Definition'
          },
          service_option_definitions: undefined
        }
      }
    ])

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId',
          services: {
            count: 1,
            items: [{
              conceptId: 'umm-s-record-1',
              type: 'ESI',
              url: {
                description: 'EOSDIS ESI Service Implementation',
                urlValue: 'http://esi-endpoint.com'
              }
            }]
          },
          tags: {
            'edsc.extra.serverless.subset_service.esi': {
              data: {
                id: 'umm-s-record-1',
                url: 'http://esi-endpoint.com',
                service_option_definitions: [{
                  id: 'service_option_def_guid',
                  name: 'Option Option'
                }],
                type: 'ESI'
              }
            }
          }
        }
      })
    }

    const result = await getAccessMethods(event, {})

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          esi0: {
            type: 'ESI',
            url: 'http://esi-endpoint.com',
            form: '<?xml version="1.0" encoding="UTF-8"?><form xmlns="http://echo.nasa.gov/v9/echoforms" xmlns:forms="http://echo.nasa.gov/v9/echoforms" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="http://ecs.nasa.gov/options" xsi:schemaLocation="http://echo.nasa.gov/v9/echoforms http://api.echo.nasa.gov/echo/wsdl/EchoForms.xsd"><!-- ECHO Service/Order form for DataSet "MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V006" (MOD13Q1.6): --><model><instance><ecs:request xmlns:ecs="http://ecs.nasa.gov/options"><!--NOTE: elements in caps losely match the ESI API, those in lowercase are helper elements --><ecs:requestInfo><ecs:email>test@edsc.com</ecs:email></ecs:requestInfo><!--Dataset ID will be injected by Reverb--><ecs:CLIENT>ESI</ecs:CLIENT><!--First SubsetAgent in the input capabilities XML is used as the default.--><ecs:SUBAGENT_ID><ecs:value>HEG</ecs:value></ecs:SUBAGENT_ID></ecs:request></instance></model></form>',
            service_option_definition: {
              id: 'service_option_def_guid',
              name: 'Service Option Definition'
            },
            service_option_definitions: undefined
          }
        },
        selectedAccessMethod: 'esi0'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  test('populates a opendap method', async () => {
    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(undefined)
      } else if (step === 2) {
        query.response({
          urs_profile: {
            email_address: 'test@edsc.com'
          }
        })
      }
    })

    const keywordMappings = {
      Keyword1: ['V123456-EDSC']
    }

    const variables = {
      'V123456-EDSC': {
        conceptId: 'V123456-EDSC',
        mock: 'data'
      }
    }

    jest.spyOn(getVariables, 'getVariables').mockImplementation(() => ({ keywordMappings, variables }))

    const event = {
      body: JSON.stringify({
        params: {
          collectionId: 'collectionId',
          services: {
            count: 1,
            items: [{
              conceptId: 'S1000000-EDSC',
              type: 'OPeNDAP',
              supportedReformattings: [{
                supportedOutputFormats: [
                  'NETCDF-3',
                  'NETCDF-4',
                  'BINARY',
                  'ASCII'
                ]
              }]
            }]
          },
          tags: {
            'edsc.extra.serverless.subset_service.opendap': {
              data: {
                id: 'S1000000-EDSC',
                type: 'OPeNDAP'
              }
            }
          }
        }
      })
    }

    const result = await getAccessMethods(event, {})

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          opendap: {
            id: 'S1000000-EDSC',
            isValid: true,
            keywordMappings,
            supportedOutputFormats: [
              'NETCDF-3',
              'NETCDF-4',
              'BINARY',
              'ASCII'
            ],
            supportsVariableSubsetting: false,
            type: 'OPeNDAP',
            variables
          }
        },
        selectedAccessMethod: 'opendap'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true
      },
      isBase64Encoded: false,
      statusCode: 200
    })
  })

  describe('saved access configurations', () => {
    test('does not populate selectedAccessMethod if no saved configuration exists', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response(undefined)
        } else if (step === 2) {
          query.response({
            urs_profile: {
              email_address: 'test@edsc.com'
            }
          })
        }
      })

      jest.spyOn(getOptionDefinitions, 'getOptionDefinitions').mockImplementation(() => [
        {
          echoOrder0: {
            form: 'mock echo form',
            option_definition: {
              id: 'option_def_guid',
              name: 'Option Definition'
            },
            option_definitions: undefined
          }
        }
      ])

      const event = {
        body: JSON.stringify({
          params: {
            collectionId: 'collectionId',
            granules: {
              count: 1,
              items: [{
                conceptId: 'G100000-EDSC',
                onlineAccessFlag: true
              }]
            },
            services: {
              count: 1,
              items: [{
                conceptId: 'umm-s-record-1',
                type: 'ECHO ORDERS',
                url: {
                  description: 'EOSDIS ECHO ORDERS Service Implementation',
                  urlValue: 'http://echo-order-endpoint.com'
                }
              }]
            },
            tags: {
              'edsc.extra.serverless.subset_service.echo_orders': {
                data: {
                  id: 'umm-s-record-1',
                  url: 'http://echo-order-endpoint.com',
                  option_definitions: [{
                    id: 'option_def_guid',
                    name: 'Option Definition'
                  }],
                  type: 'ECHO ORDERS'
                }
              }
            }
          }
        })
      }

      const result = await getAccessMethods(event, {})

      expect(result).toEqual({
        body: JSON.stringify({
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            },
            echoOrder0: {
              type: 'ECHO ORDERS',
              url: 'http://echo-order-endpoint.com',
              form: 'mock echo form',
              option_definition: {
                id: 'option_def_guid',
                name: 'Option Definition'
              },
              option_definitions: undefined
            }
          }
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': true
        },
        isBase64Encoded: false,
        statusCode: 200
      })
    })

    test('does not populate selectedAccessMethod if method is download', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            access_method: {
              type: 'download',
              isValid: true
            }
          })
        } else if (step === 2) {
          query.response({
            urs_profile: {
              email_address: 'test@edsc.com'
            }
          })
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            collectionId: 'collectionId',
            granules: {
              count: 1,
              items: [{
                conceptId: 'G100000-EDSC',
                onlineAccessFlag: true
              }]
            },
            services: {
              count: 1,
              items: [{
                conceptId: 'umm-s-record-1',
                type: 'ECHO ORDERS',
                url: {
                  description: 'EOSDIS ECHO ORDERS Service Implementation',
                  urlValue: 'http://echo-order-endpoint.com'
                }
              }]
            }
          }
        })
      }

      const result = await getAccessMethods(event, {})

      expect(result).toEqual({
        body: JSON.stringify({
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          selectedAccessMethod: 'download'
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': true
        },
        isBase64Encoded: false,
        statusCode: 200
      })
    })

    test('does not populate selectedAccessMethod when an error occurrs', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.reject('Unknown Error')
        } else if (step === 2) {
          query.response({
            urs_profile: {
              email_address: 'test@edsc.com'
            }
          })
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            collectionId: 'collectionId',
            granules: {
              count: 1,
              items: [{
                conceptId: 'G100000-EDSC',
                onlineAccessFlag: true
              }]
            },
            services: {
              count: 1,
              items: [{
                conceptId: 'umm-s-record-1',
                type: 'ECHO ORDERS',
                url: {
                  description: 'EOSDIS ECHO ORDERS Service Implementation',
                  urlValue: 'http://echo-order-endpoint.com'
                }
              }]
            }
          }
        })
      }

      const result = await getAccessMethods(event, {})

      expect(result.statusCode).toEqual(500)
    })

    test('populates the saved access configuration', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            access_method: {
              type: 'ECHO ORDERS',
              form: '<form>echo form</form>',
              option_definition: {
                id: 'option_def_guid',
                name: 'Option Definition'
              },
              model: '<mock>model</mock>',
              rawModel: '<mock>raw model</mock>',
              form_digest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
            }
          })
        } else if (step === 2) {
          query.response({
            urs_profile: {
              email_address: 'test@edsc.com'
            }
          })
        }
      })

      jest.spyOn(getOptionDefinitions, 'getOptionDefinitions').mockImplementation(() => [
        {
          echoOrder0: {
            form: '<form>echo form</form>',
            option_definition: {
              id: 'option_def_guid',
              name: 'Option Definition'
            },
            option_definitions: undefined
          }
        }
      ])

      const event = {
        body: JSON.stringify({
          params: {
            collectionId: 'collectionId',
            granules: {
              count: 1,
              items: [{
                conceptId: 'G100000-EDSC',
                onlineAccessFlag: true
              }]
            },
            services: {
              count: 1,
              items: [{
                conceptId: 'umm-s-record-1',
                type: 'ECHO ORDERS',
                url: {
                  description: 'EOSDIS ECHO ORDERS Service Implementation',
                  urlValue: 'http://echo-order-endpoint.com'
                }
              }]
            },
            tags: {
              'edsc.extra.serverless.subset_service.echo_orders': {
                data: {
                  id: 'umm-s-record-1',
                  option_definitions: [{
                    id: 'option_def_guid',
                    name: 'Option Definition'
                  }],
                  type: 'ECHO ORDERS'
                }
              }
            }
          }
        })
      }

      const result = await getAccessMethods(event, {})

      expect(result).toEqual({
        body: JSON.stringify({
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            },
            echoOrder0: {
              type: 'ECHO ORDERS',
              url: 'http://echo-order-endpoint.com',
              form: '<form>echo form</form>',
              option_definition: {
                id: 'option_def_guid',
                name: 'Option Definition'
              },
              option_definitions: undefined,
              model: '<mock>model</mock>',
              rawModel: '<mock>raw model</mock>',
              form_digest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
            }
          },
          selectedAccessMethod: 'echoOrder0'
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': true
        },
        isBase64Encoded: false,
        statusCode: 200
      })
    })

    test('populates the default access configuration if the saved access config has malformed XML', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            access_method: {
              type: 'ECHO ORDERS',
              form: '<form a="a"b="b">echo form</form>',
              option_definition: {
                id: 'option_def_guid',
                name: 'Option Definition'
              },
              model: '<mock>model</mock>',
              rawModel: '<mock>raw model</mock>',
              form_digest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
            }
          })
        } else if (step === 2) {
          query.response({
            urs_profile: {
              email_address: 'test@edsc.com'
            }
          })
        }
      })

      jest.spyOn(getOptionDefinitions, 'getOptionDefinitions').mockImplementation(() => [
        {
          echoOrder0: {
            form: '<form>echo form</form>',
            option_definition: {
              id: 'option_def_guid',
              name: 'Option Definition'
            },
            option_definitions: undefined
          }
        }
      ])

      const event = {
        body: JSON.stringify({
          params: {
            collectionId: 'collectionId',
            granules: {
              count: 1,
              items: [{
                conceptId: 'G100000-EDSC',
                onlineAccessFlag: true
              }]
            },
            services: {
              count: 1,
              items: [{
                conceptId: 'umm-s-record-1',
                type: 'ECHO ORDERS',
                url: {
                  description: 'EOSDIS ECHO ORDERS Service Implementation',
                  urlValue: 'http://echo-order-endpoint.com'
                }
              }]
            },
            tags: {
              'edsc.extra.serverless.subset_service.echo_orders': {
                data: {
                  id: 'umm-s-record-1',
                  option_definitions: [{
                    id: 'option_def_guid',
                    name: 'Option Definition'
                  }],
                  type: 'ECHO ORDERS'
                }
              }
            }
          }
        })
      }

      const result = await getAccessMethods(event, {})

      expect(result).toEqual({
        body: JSON.stringify({
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            },
            echoOrder0: {
              type: 'ECHO ORDERS',
              url: 'http://echo-order-endpoint.com',
              form: '<form>echo form</form>',
              option_definition: {
                id: 'option_def_guid',
                name: 'Option Definition'
              },
              option_definitions: undefined
            }
          },
          selectedAccessMethod: 'echoOrder0'
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': true
        },
        isBase64Encoded: false,
        statusCode: 200
      })
    })

    test('populates the default access configuration if the saved access config does not have model and rawModel', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            access_method: {
              type: 'ECHO ORDERS',
              form: '<form a="a"b="b">echo form</form>',
              option_definition: {
                id: 'option_def_guid',
                name: 'Option Definition'
              },
              form_digest: '95d8b918c2634d9d27daece7bf941a33caec9bb6'
            }
          })
        } else if (step === 2) {
          query.response({
            urs_profile: {
              email_address: 'test@edsc.com'
            }
          })
        }
      })

      jest.spyOn(getOptionDefinitions, 'getOptionDefinitions').mockImplementation(() => [
        {
          echoOrder0: {
            form: '<form>echo form</form>',
            option_definition: {
              id: 'option_def_guid',
              name: 'Option Definition'
            },
            option_definitions: undefined
          }
        }
      ])

      const event = {
        body: JSON.stringify({
          params: {
            collectionId: 'collectionId',
            granules: {
              count: 1,
              items: [{
                conceptId: 'G100000-EDSC',
                onlineAccessFlag: true
              }]
            },
            services: {
              count: 1,
              items: [{
                conceptId: 'umm-s-record-1',
                type: 'ECHO ORDERS',
                url: {
                  description: 'EOSDIS ECHO ORDERS Service Implementation',
                  urlValue: 'http://echo-order-endpoint.com'
                }
              }]
            },
            tags: {
              'edsc.extra.serverless.subset_service.echo_orders': {
                data: {
                  id: 'umm-s-record-1',
                  option_definitions: [{
                    id: 'option_def_guid',
                    name: 'Option Definition'
                  }],
                  type: 'ECHO ORDERS'
                }
              }
            }
          }
        })
      }

      const result = await getAccessMethods(event, {})

      expect(result).toEqual({
        body: JSON.stringify({
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            },
            echoOrder0: {
              type: 'ECHO ORDERS',
              url: 'http://echo-order-endpoint.com',
              form: '<form>echo form</form>',
              option_definition: {
                id: 'option_def_guid',
                name: 'Option Definition'
              },
              option_definitions: undefined
            }
          },
          selectedAccessMethod: 'echoOrder0'
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': true
        },
        isBase64Encoded: false,
        statusCode: 200
      })
    })
  })
})
