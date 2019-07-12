import getAccessMethods from '../handler'
import * as getJwtToken from '../../util'
import * as getOptionDefinitions from '../getOptionDefinitions'


beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
})

describe('getAccessMethods', () => {
  test('populates a download method', async () => {
    const event = {
      body: JSON.stringify({
        params: {
          collection_id: 'collectionId',
          tags: {
            'edsc.extra.serverless.collection_capabilities': {
              data: {
                granule_online_access_flag: true
              }
            }
          }
        }
      })
    }

    const result = await getAccessMethods(event)

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          download: {
            isValid: true,
            type: 'download'
          }
        }
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      statusCode: 200
    })
  })

  test('populates a echoOrder method', async () => {
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
          collection_id: 'collectionId',
          tags: {
            'edsc.extra.serverless.subset_service.echo_orders': {
              data: {
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

    const result = await getAccessMethods(event)

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          echoOrder0: {
            type: 'ECHO ORDERS',
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
        'Access-Control-Allow-Credentials': true
      },
      statusCode: 200
    })
  })

  test('populates a esi method', async () => {
    const event = {
      body: JSON.stringify({
        params: {
          collection_id: 'collectionId',
          tags: {
            'edsc.extra.serverless.subset_service.esi': {
              data: {}
            }
          }
        }
      })
    }

    const result = await getAccessMethods(event)

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          esi: {
            type: 'ESI'
          }
        }
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      statusCode: 200
    })
  })

  test('populates a opendap method', async () => {
    const event = {
      body: JSON.stringify({
        params: {
          collection_id: 'collectionId',
          tags: {
            'edsc.extra.serverless.subset_service.opendap': {
              data: {}
            }
          }
        }
      })
    }

    const result = await getAccessMethods(event)

    expect(result).toEqual({
      body: JSON.stringify({
        accessMethods: {
          opendap: {
            type: 'OPeNDAP'
          }
        }
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      statusCode: 200
    })
  })
})
