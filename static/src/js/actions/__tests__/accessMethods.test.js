import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import { fetchAccessMethods } from '../accessMethods'
import { ADD_ACCESS_METHODS, ADD_ERROR } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('fetchAccessMethods', () => {
  test('does not fetch access methods if the user is not logged in', () => {
    const store = mockStore({
      authToken: ''
    })

    // call the dispatch
    expect(store.dispatch(fetchAccessMethods(['collectionId']))).toEqual(
      new Promise((resolve) => resolve(null))
    )
  })

  test('does not fetch access methods if no collections were provided', () => {
    const store = mockStore({
      authToken: ''
    })

    // call the dispatch
    expect(store.dispatch(fetchAccessMethods())).toEqual(
      new Promise((resolve) => resolve(null))
    )
  })

  test('calls the error logger when providers action fails', async () => {
    const collectionId = 'collectionId'

    nock(/localhost/)
      .get(/providers/)
      .reply(500, {
        errors: ['HTTP Request Error']
      },
      {
        'jwt-token': 'token'
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: '123',
      metadata: {
        collections: {
          collectionId: {
            services: {
              count: 0,
              items: null
            },
            granules: {
              count: 1,
              items: [{
                id: 'G100000-EDSC',
                onlineAccessFlag: true
              }]
            }
          }
        }
      },
      project: {
        collections: {
          byId: {
            collectionId: {
              granules: {
                hits: 100
              }
            }
          },
          allIds: [collectionId]
        }
      },
      providers: []
    })

    // call the dispatch
    await store.dispatch(fetchAccessMethods([collectionId]))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_ERROR,
      payload: expect.objectContaining({
        title: 'Error retrieving providers',
        message: 'HTTP Request Error'
      })
    })
  })

  test('calls the error logger when the collections request fails', async () => {
    const collectionId = 'collectionId'

    nock(/localhost/)
      .post(/access_methods/)
      .reply(500, {
        errors: ['HTTP Request Error']
      },
      {
        'jwt-token': 'token'
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: '123',
      metadata: {
        collections: {
          collectionId: {
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
                  option_definitions: [
                    {
                      id: 'option_definition_guid',
                      name: 'Delivery Option'
                    }
                  ]
                }
              }
            }
          }
        }
      },
      project: {
        collections: {
          allIds: [collectionId],
          byId: {
            collectionId: {
              granules: {
                hits: 5000
              }
            }
          }
        }
      },
      providers: [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ]
    })

    // call the dispatch
    await store.dispatch(fetchAccessMethods([collectionId]))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_ERROR,
      payload: expect.objectContaining({
        title: 'Error retrieving access methods',
        message: 'HTTP Request Error'
      })
    })
  })

  test('returns download method if it is the only access method', async () => {
    const collectionId = 'collectionId'

    const store = mockStore({
      authToken: '123',
      metadata: {
        collections: {
          collectionId: {
            services: {
              count: 0,
              items: null
            },
            granules: {
              count: 1,
              items: [{
                id: 'G100000-EDSC',
                onlineAccessFlag: true
              }]
            }
          }
        }
      },
      project: {
        collections: {
          allIds: [collectionId],
          byId: {
            collectionId: {
              granules: {
                hits: 100
              }
            }
          }
        }
      },
      providers: [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ]
    })

    // call the dispatch
    await store.dispatch(fetchAccessMethods([collectionId])).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: ADD_ACCESS_METHODS,
        payload: {
          collectionId,
          methods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          selectedAccessMethod: 'download'
        }
      })
    })
  })

  test('fetches access methods from api if needed', async () => {
    const download = {
      isValid: true,
      type: 'download'
    }

    const echoOrder0 = {
      id: 'service_id',
      type: 'ECHO ORDERS',
      url: 'mock url',
      option_definition: {
        id: 'option_definition_guid',
        name: 'Delivery Option'
      },
      form: 'mock form here'
    }

    nock(/localhost/)
      .post(/access_methods/)
      .reply(200, {
        accessMethods: {
          download,
          echoOrder0
        }
      })

    const collectionId = 'collectionId'
    const store = mockStore({
      authToken: '123',
      metadata: {
        collections: {
          collectionId: {
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
                  option_definitions: [
                    {
                      id: 'option_definition_guid',
                      name: 'Delivery Option'
                    }
                  ]
                }
              }
            }
          }
        }
      },
      project: {
        collections: {
          allIds: [collectionId],
          byId: {
            collectionId: {
              granules: {
                hits: 100
              }
            }
          }
        }
      },
      providers: [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ]
    })

    // call the dispatch
    await store.dispatch(fetchAccessMethods([collectionId])).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: ADD_ACCESS_METHODS,
        payload: {
          collectionId,
          methods: {
            download,
            echoOrder0
          }
        }
      })
    })
  })

  test('returns download method if it is an open search collection', async () => {
    const collectionId = 'collectionId'

    const store = mockStore({
      authToken: '123',
      metadata: {
        collections: {
          collectionId: {
            isOpenSearch: true,
            services: {
              count: 0,
              items: null
            },
            granules: {
              count: 0,
              items: []
            }
          }
        }
      },
      project: {
        collections: {
          allIds: [collectionId],
          byId: {
            collectionId: {
              granules: {
                hits: 100
              }
            }
          }
        }
      },
      providers: [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ]
    })

    // call the dispatch
    await store.dispatch(fetchAccessMethods([collectionId])).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: ADD_ACCESS_METHODS,
        payload: {
          collectionId,
          methods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          selectedAccessMethod: 'download'
        }
      })
    })
  })
})
