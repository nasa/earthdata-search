import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { SET_RETRIEVAL_LOADING } from '../../constants/actionTypes'

import { submitRetrieval, fetchRetrieval } from '../retrieval'

import * as getApplicationConfig from '../../../../../sharedUtils/config'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('submitRetrieval', () => {
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      defaultPortal: 'edsc',
      env: 'prod'
    }))
  })

  test('calls lambda to submit an order', async () => {
    nock(/localhost/)
      .post(/retrievals/)
      .reply(200, {
        id: 7
      })

    // MockStore with initialState
    const store = mockStore({
      authToken: 'mockToken',
      earthdataEnvironment: 'prod',
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
      portal: {
        portalId: 'edsc'
      },
      project: {
        collections: {
          byId: {
            collectionId: {
              accessMethods: {
                download: {
                  type: 'download'
                }
              },
              selectedAccessMethod: 'download',
              granules: {
                hits: 84
              }
            }
          },
          allIds: ['collectionId']
        }
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      },
      shapefile: {}
    })

    // Call the dispatch
    await store.dispatch(submitRetrieval()).then(() => {
      expect(store.getActions().length).toEqual(4)

      expect(store.getActions()[0]).toEqual({
        payload: {
          type: 'data_access_completion',
          collections: [{
            collectionId: 'collectionId',
            service: 'Download',
            type: 'download'
          }]
        },
        type: 'METRICS_DATA_ACCESS'
      })

      expect(store.getActions()[1]).toEqual({
        type: 'SUBMITTING_PROJECT'
      })

      expect(store.getActions()[2]).toEqual({
        type: 'SUBMITTED_PROJECT'
      })

      expect(store.getActions()[3]).toEqual({
        payload: {
          args: ['/downloads/7'],
          method: 'push'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })
  })

  test('directs the user to the retrieval page with ee param included if different than the deployed environment', async () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      defaultPortal: 'edsc',
      env: 'uat'
    }))

    nock(/localhost/)
      .post(/retrievals/)
      .reply(200, {
        id: 7
      })

    // MockStore with initialState
    const store = mockStore({
      authToken: 'mockToken',
      earthdataEnvironment: 'prod',
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
      portal: {
        portalId: 'edsc'
      },
      project: {
        collections: {
          byId: {
            collectionId: {
              accessMethods: {
                download: {
                  type: 'download'
                }
              },
              selectedAccessMethod: 'download',
              granules: {
                hits: 84
              }
            }
          },
          allIds: ['collectionId']
        }
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      },
      shapefile: {}
    })

    // Call the dispatch
    await store.dispatch(submitRetrieval()).then(() => {
      expect(store.getActions()[3]).toEqual({
        payload: {
          args: ['/downloads/7?ee=prod'],
          method: 'push'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })
  })

  test('does not call updateCollectionResults on error', async () => {
    nock(/localhost/)
      .post(/retrievals/)
      .reply(500, {
        errors: ['An error occured.']
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      metadata: {
        collections: {
          collectionId: {}
        },
        granules: {}
      },
      query: {
        collection: {
          pageNum: 1,
          keyword: 'search keyword'
        }
      },
      portal: {
        portalId: 'edsc'
      },
      project: {
        collections: {
          byId: {
            collectionId: {
              accessMethods: {
                download: {
                  type: 'download'
                }
              },
              selectedAccessMethod: 'download',
              granules: {
                hits: 84
              }
            }
          },
          allIds: ['collectionId']
        }
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      },
      shapefile: {}
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(submitRetrieval()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('metricsDataAccess', () => {
    test('saves metrics for download retrievals', () => {
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      // MockStore with initialState
      const store = mockStore({
        authToken: 'mockToken',
        earthdataEnvironment: 'prod',
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
        portal: {
          portalId: 'edsc'
        },
        project: {
          collections: {
            byId: {
              collectionId: {
                accessMethods: {
                  download: {
                    type: 'download'
                  }
                },
                selectedAccessMethod: 'download',
                granules: {
                  hits: 84
                }
              }
            },
            allIds: ['collectionId']
          }
        },
        router: {
          location: {
            search: '?some=testparams'
          }
        },
        shapefile: {}
      })

      // Call the dispatch
      store.dispatch(submitRetrieval()).then(() => {
        expect(store.getActions().length).toEqual(4)

        expect(store.getActions()[0]).toEqual({
          payload: {
            type: 'data_access_completion',
            collections: [{
              collectionId: 'collectionId',
              service: 'Download',
              type: 'download'
            }]
          },
          type: 'METRICS_DATA_ACCESS'
        })
      })
    })

    test('saves metrics for echo orders retrievals', () => {
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      // MockStore with initialState
      const store = mockStore({
        authToken: 'mockToken',
        earthdataEnvironment: 'prod',
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
        portal: {
          portalId: 'edsc'
        },
        project: {
          collections: {
            byId: {
              collectionId: {
                accessMethods: {
                  echoOrder0: {
                    type: 'ECHO ORDERS',
                    optionDefinition: {
                      name: 'Mock Order'
                    }
                  }
                },
                selectedAccessMethod: 'echoOrder0',
                granules: {
                  hits: 84
                }
              }
            },
            allIds: ['collectionId']
          }
        },
        router: {
          location: {
            search: '?some=testparams'
          }
        },
        shapefile: {}
      })

      // Call the dispatch
      store.dispatch(submitRetrieval()).then(() => {
        expect(store.getActions().length).toEqual(4)

        expect(store.getActions()[0]).toEqual({
          payload: {
            type: 'data_access_completion',
            collections: [{
              collectionId: 'collectionId',
              service: 'Mock Order',
              type: 'order'
            }]
          },
          type: 'METRICS_DATA_ACCESS'
        })
      })
    })

    test('saves metrics for esi retrievals', () => {
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      // MockStore with initialState
      const store = mockStore({
        authToken: 'mockToken',
        earthdataEnvironment: 'prod',
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
        portal: {
          portalId: 'edsc'
        },
        project: {
          collections: {
            byId: {
              collectionId: {
                accessMethods: {
                  esi0: {
                    type: 'ESI',
                    optionDefinition: {
                      name: 'Mock Order'
                    }
                  }
                },
                selectedAccessMethod: 'esi0',
                granules: {
                  hits: 84
                }
              }
            },
            allIds: ['collectionId']
          }
        },
        router: {
          location: {
            search: '?some=testparams'
          }
        },
        shapefile: {}
      })

      // Call the dispatch
      store.dispatch(submitRetrieval()).then(() => {
        expect(store.getActions().length).toEqual(4)

        expect(store.getActions()[0]).toEqual({
          payload: {
            type: 'data_access_completion',
            collections: [{
              collectionId: 'collectionId',
              service: 'Mock Order',
              type: 'esi'
            }]
          },
          type: 'METRICS_DATA_ACCESS'
        })
      })
    })

    test('saves metrics for opendap retrievals', () => {
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      // MockStore with initialState
      const store = mockStore({
        authToken: 'mockToken',
        earthdataEnvironment: 'prod',
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
        portal: {
          portalId: 'edsc'
        },
        project: {
          collections: {
            byId: {
              collectionId: {
                accessMethods: {
                  opendap: {
                    type: 'OPeNDAP'
                  }
                },
                selectedAccessMethod: 'opendap',
                granules: {
                  hits: 84
                }
              }
            },
            allIds: ['collectionId']
          }
        },
        router: {
          location: {
            search: '?some=testparams'
          }
        },
        shapefile: {}
      })

      // Call the dispatch
      store.dispatch(submitRetrieval()).then(() => {
        expect(store.getActions().length).toEqual(4)

        expect(store.getActions()[0]).toEqual({
          payload: {
            type: 'data_access_completion',
            collections: [{
              collectionId: 'collectionId',
              service: 'OPeNDAP',
              type: 'opendap'
            }]
          },
          type: 'METRICS_DATA_ACCESS'
        })
      })
    })

    test('saves metrics for harmony retrievals', () => {
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      // MockStore with initialState
      const store = mockStore({
        authToken: 'mockToken',
        earthdataEnvironment: 'prod',
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
        portal: {
          portalId: 'edsc'
        },
        project: {
          collections: {
            byId: {
              collectionId: {
                accessMethods: {
                  harmony0: {
                    type: 'Harmony',
                    name: 'mock-harmony-service'
                  }
                },
                selectedAccessMethod: 'harmony0',
                granules: {
                  hits: 84
                }
              }
            },
            allIds: ['collectionId']
          }
        },
        router: {
          location: {
            search: '?some=testparams'
          }
        },
        shapefile: {}
      })

      // Call the dispatch
      store.dispatch(submitRetrieval()).then(() => {
        expect(store.getActions().length).toEqual(4)

        expect(store.getActions()[0]).toEqual({
          payload: {
            type: 'data_access_completion',
            collections: [{
              collectionId: 'collectionId',
              service: 'mock-harmony-service',
              type: 'harmony'
            }]
          },
          type: 'METRICS_DATA_ACCESS'
        })
      })
    })

    test('saves metrics for swodlr retrievals', () => {
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      // MockStore with initialState
      const store = mockStore({
        authToken: 'mockToken',
        earthdataEnvironment: 'prod',
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
        portal: {
          portalId: 'edsc'
        },
        project: {
          collections: {
            byId: {
              collectionId: {
                accessMethods: {
                  swodlr: {
                    type: 'SWODLR',
                    name: 'podaac-swodlr-service'
                  }
                },
                selectedAccessMethod: 'swodlr',
                granules: {
                  hits: 2
                }
              }
            },
            allIds: ['collectionId']
          }
        },
        router: {
          location: {
            search: '?some=testparams'
          }
        },
        shapefile: {}
      })

      // Call the dispatch
      store.dispatch(submitRetrieval()).then(() => {
        expect(store.getActions().length).toEqual(4)

        expect(store.getActions()[0]).toEqual({
          payload: {
            type: 'data_access_completion',
            collections: [{
              collectionId: 'collectionId',
              service: 'SWODLR',
              type: 'swodlr'
            }]
          },
          type: 'METRICS_DATA_ACCESS'
        })
      })
    })
  })
})

describe('fetchRetrieval', () => {
  test('calls lambda to get an order', async () => {
    nock(/localhost/)
      .get(/retrievals/)
      .reply(200, {
        id: 7,
        environment: 'prod',
        jsondata: {
          test: 'data'
        },
        collections: {
          download: [1, 2],
          byId: {
            1: {
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
            2: {
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
          }
        },
        links: [{
          datasetId: 'Test one',
          links: [
            {
              href: 'http://link.com/12345-TEST/test-href',
              hreflang: 'en-US',
              rel: 'http://link.com/12345-TEST/test-rel/metadata#'
            }
          ]
        }, {
          datasetId: 'Test two',
          links: [
            {
              href: 'http://link.com/67890-TEST/test-href',
              hreflang: 'en-US',
              rel: 'http://link.com/67890-TEST/test-rel/metadata#'
            }
          ]
        }]
      })

    // MockStore with initialState
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
        allIds: ['collectionId']
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      }
    })

    // Call the dispatch
    await store.dispatch(fetchRetrieval(7)).then(() => {
      expect(store.getActions().length).toEqual(2)
      expect(store.getActions()[0]).toEqual({
        type: SET_RETRIEVAL_LOADING
      })

      expect(store.getActions()[1]).toEqual({
        payload: {
          collections: {
            download: [1, 2],
            byId: {
              1: {
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
                },
                isLoading: false,
                isLoaded: true
              },
              2: {
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
                },
                isLoading: false,
                isLoaded: true
              }
            }
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
        type: 'UPDATE_RETRIEVAL'
      })
    })
  })

  test('does not call updateOrder on error', async () => {
    nock(/localhost/)
      .get(/retrievals/)
      .reply(500, {
        errors: ['An error occured.']
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

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
        allIds: ['collectionId']
      },
      router: {
        location: {
          search: '?some=testparams'
        }
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(fetchRetrieval(7)).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
