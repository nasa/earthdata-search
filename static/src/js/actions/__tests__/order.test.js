import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  submitOrder,
  fetchOrder
} from '../order'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('submitOrder', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls lambda to submit an order', async () => {
    moxios.stubRequest(/\/orders/, {
      status: 200,
      response: {
        id: 7
      },
      headers: {}
    })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'mockToken',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {},
              metadata: {}
            }
          }
        }
      },
      query: {
        collection: {
          pageNum: 1,
          keyword: 'search keyword'
        },
        granule: {
          pageNum: 1
        }
      },
      project: {
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        },
        collectionIds: ['collectionId']
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      },
      shapefile: {}
    })

    // call the dispatch
    await store.dispatch(submitOrder()).then(() => {
      expect(store.getActions().length).toEqual(1)
      expect(store.getActions()[0]).toEqual({
        payload: {
          args: ['/data/retrieve/7'],
          method: 'push'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })
  })

  test('does not call updateCollectionResults on error', async () => {
    moxios.stubRequest(/orders.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      authToken: 'mockToken',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {},
              metadata: {}
            }
          }
        }
      },
      query: {
        collection: {
          pageNum: 1,
          keyword: 'search keyword'
        },
        granule: {
          pageNum: 1
        }
      },
      project: {
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        },
        collectionIds: ['collectionId']
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      },
      shapefile: {}
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(submitOrder()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('fetchOrder', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls lambda to get an order', async () => {
    moxios.stubRequest(/\/retrievals/, {
      status: 200,
      response: {
        id: 7,
        environment: 'prod',
        jsondata: {
          test: 'data'
        },
        collections: [
          {
            collection_id: '12345-TEST',
            access_method: {
              type: 'download'
            },
            collection_metadata: {
              dataset_id: 'Test one',
              links: [
                {
                  href: 'http://link.com/12345-TEST/test-href',
                  hreflang: 'en-US',
                  rel: 'http://link.com/12345-TEST/test-rel/metadata#'
                },
                {
                  href: 'http://link.com/12345-TEST/test-href/somethingelse',
                  hreflang: 'en-US',
                  rel: 'http://link.com/12345-TEST/test-rel/somethingelse#'
                }
              ]
            }
          },
          {
            collection_id: '67890-TEST',
            access_method: {
              type: 'download'
            },
            collection_metadata: {
              dataset_id: 'Test two',
              links: [
                {
                  href: 'http://link.com/67890-TEST/test-href',
                  hreflang: 'en-US',
                  rel: 'http://link.com/67890-TEST/test-rel/metadata#'
                },
                {
                  href: 'http://link.com/67890-TEST/test-href/somethingelse',
                  hreflang: 'en-US',
                  rel: 'http://link.com/67890-TEST/test-rel/somethingelse#'
                }
              ]
            }
          }
        ]
      },
      headers: {}
    })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'mockToken',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {},
              metadata: {}
            }
          }
        }
      },
      query: {
        collection: {
          pageNum: 1,
          keyword: 'search keyword'
        },
        granule: {
          pageNum: 1
        }
      },
      project: {
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        },
        collectionIds: ['collectionId']
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      }
    })

    // call the dispatch
    await store.dispatch(fetchOrder(7)).then(() => {
      expect(store.getActions().length).toEqual(1)
      expect(store.getActions()[0]).toEqual({
        payload: {
          collections: {
            download: [
              {
                access_method: {
                  type: 'download'
                },
                collection_id: '12345-TEST',
                collection_metadata: {
                  dataset_id: 'Test one',
                  links: [
                    {
                      href: 'http://link.com/12345-TEST/test-href',
                      hreflang: 'en-US',
                      rel: 'http://link.com/12345-TEST/test-rel/metadata#'
                    },
                    {
                      href: 'http://link.com/12345-TEST/test-href/somethingelse',
                      hreflang: 'en-US',
                      rel: 'http://link.com/12345-TEST/test-rel/somethingelse#'
                    }
                  ]
                }
              },
              {
                access_method: {
                  type: 'download'
                },
                collection_id: '67890-TEST',
                collection_metadata: {
                  dataset_id: 'Test two',
                  links: [
                    {
                      href: 'http://link.com/67890-TEST/test-href',
                      hreflang: 'en-US',
                      rel: 'http://link.com/67890-TEST/test-rel/metadata#'
                    },
                    {
                      href: 'http://link.com/67890-TEST/test-href/somethingelse',
                      hreflang: 'en-US',
                      rel: 'http://link.com/67890-TEST/test-rel/somethingelse#'
                    }
                  ]
                }
              }
            ],
            echo_orders: [],
            esi: []
          },
          environment: 'prod',
          id: 7,
          jsondata: {
            test: 'data'
          },
          links: [
            {
              datasetId: 'Test one',
              links: [{
                href: 'http://link.com/12345-TEST/test-href',
                hreflang: 'en-US',
                rel: 'http://link.com/12345-TEST/test-rel/metadata#'
              }]
            },
            {
              datasetId: 'Test two',
              links: [{
                href: 'http://link.com/67890-TEST/test-href',
                hreflang: 'en-US',
                rel: 'http://link.com/67890-TEST/test-rel/metadata#'
              }]
            }
          ]
        },
        type: 'UPDATE_ORDER'
      })
    })
  })

  test('does not call updateOrder on error', async () => {
    moxios.stubRequest(/retrievals.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      authToken: 'mockToken',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {},
              metadata: {}
            }
          }
        }
      },
      query: {
        collection: {
          pageNum: 1,
          keyword: 'search keyword'
        },
        granule: {
          pageNum: 1
        }
      },
      project: {
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        },
        collectionIds: ['collectionId']
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(fetchOrder()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
