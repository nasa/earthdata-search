import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import {
  UPDATE_SAVED_PROJECT,
  RESTORE_FROM_URL
} from '../../constants/actionTypes'

import * as urlQuery from '../urlQuery'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()

  jest.spyOn(actions, 'fetchProviders').mockImplementation(() => jest.fn())
})

describe('updateStore', () => {
  test('calls restoreFromUrl and gets new search results', () => {
    const params = {
      cmrFacets: {},
      earthdataEnvironment: 'prod',
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false,
        nearRealTime: false
      },
      focusedCollection: 'C00001-EDSC',
      map: {},
      project: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      query: {
        collection: {
          overrideTemporal: {},
          pageNum: 1,
          spatial: {},
          temporal: {}
        }
      },
      shapefile: {}
    }

    const store = mockStore({
      preferences: {
        preferences: {
          collectionSort: 'default'
        }
      },
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    store.dispatch(urlQuery.updateStore(params))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        ...params,
        query: {
          ...params.query,
          collectionSortPreference: 'default'
        }
      },
      type: RESTORE_FROM_URL
    })
  })

  describe('on the projects page', () => {
    test('calls restoreFromUrl and gets new search results', async () => {
      const params = {
        cmrFacets: {},
        earthdataEnvironment: 'prod',
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        },
        focusedCollection: 'C00001-EDSC',
        map: {},
        project: {
          collections: {
            allIds: ['C00001-EDSC'],
            byId: {}
          }
        },
        query: {
          collection: {
            overrideTemporal: {},
            pageNum: 1,
            spatial: {},
            temporal: {}
          },
          granule: { pageNum: 1 }
        },
        shapefile: {}
      }

      jest.spyOn(actions, 'getProjectCollections').mockImplementation(() => jest.fn())
      jest.spyOn(actions, 'fetchAccessMethods').mockImplementation(() => jest.fn())
      jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())

      const store = mockStore({
        preferences: {
          preferences: {
            collectionSort: 'default'
          }
        },
        router: {
          location: {
            pathname: '/projects'
          }
        }
      })
      await store.dispatch(urlQuery.updateStore(params, '/projects'))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          ...params,
          query: {
            ...params.query,
            collectionSortPreference: 'default'
          }
        },
        type: RESTORE_FROM_URL
      })
    })
  })
})

describe('changePath', () => {
  test('retrieves path from database if there is a projectId', async () => {
    nock(/localhost/)
      .get(/projects/)
      .reply(200, {
        name: null,
        path: '/search?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
      })

    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())
    const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
    const getProjectCollectionsMock = jest.spyOn(actions, 'getProjectCollections').mockImplementation(() => jest.fn())
    const getProjectGranulesMock = jest.spyOn(actions, 'getProjectGranules').mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())

    const newPath = '/search?projectId=1'

    const store = mockStore({
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          'C00001-EDSC': {
            services: [],
            variables: []
          }
        },
        granules: {}
      },
      project: {
        collections: {
          allIds: ['C00001-EDSC'],
          byId: {}
        }
      },
      providers: [],
      query: {},
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    await store.dispatch(urlQuery.changePath(newPath)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          name: null,
          projectId: '1',
          path: '/search?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
        },
        type: UPDATE_SAVED_PROJECT
      })

      expect(updateStoreMock).toBeCalledTimes(1)
      expect(updateStoreMock).toBeCalledWith(
        expect.objectContaining({
          featureFacets: {
            availableInEarthdataCloud: false,
            customizable: false,
            mapImagery: false,
            nearRealTime: false
          },
          deprecatedUrlParams: [],
          focusedCollection: 'C00001-EDSC',
          map: {},
          project: {
            collections: {
              allIds: ['C00001-EDSC'],
              byId: {
                'C00001-EDSC': {
                  granules: {},
                  isVisible: true
                }
              }
            }
          },
          query: {
            collection: {
              byId: {
                'C00001-EDSC': {
                  granules: {
                    pageNum: 1
                  }
                }
              },
              hasGranulesOrCwic: true,
              overrideTemporal: {},
              pageNum: 1,
              spatial: {},
              temporal: {}
            }
          },
          shapefile: {
            shapefileId: ''
          }
        })
      )

      expect(getCollectionsMock).toBeCalledTimes(1)
      expect(getProjectCollectionsMock).toBeCalledTimes(1)
      expect(getProjectGranulesMock).toBeCalledTimes(1)
      expect(getTimelineMock).toBeCalledTimes(1)
    })
  })

  test('updates the store if there is not a projectId', () => {
    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())
    const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())

    const newPath = '/search?p=C00001-EDSC'

    const store = mockStore({
      earthdataEnvironment: 'prod',
      project: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      query: {
        collection: {
          spatial: {}
        }
      },
      router: {
        location: {
          pathname: '/search'
        }
      },
      timeline: {
        query: {}
      }
    })

    store.dispatch(urlQuery.changePath(newPath))

    expect(updateStoreMock).toBeCalledTimes(1)
    expect(updateStoreMock).toBeCalledWith(
      expect.objectContaining({
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        },
        focusedCollection: 'C00001-EDSC',
        map: {},
        query: {
          collection: {
            byId: {
              'C00001-EDSC': {
                granules: {
                  pageNum: 1
                }
              }
            },
            hasGranulesOrCwic: true,
            overrideTemporal: {},
            pageNum: 1,
            spatial: {},
            temporal: {}
          }
        },
        shapefile: {
          shapefileId: ''
        }
      }), '/search'
    )

    expect(getCollectionsMock).toBeCalledTimes(1)
    expect(getTimelineMock).toBeCalledTimes(1)
  })

  describe('when a path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getFocusedCollection action', () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/search/granules?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          providers: [],
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getFocusedCollection action', () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/search/granules/collection-details?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          providers: [],
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getFocusedCollection action', () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/search/granules/subscriptions?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          providers: [],
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getFocusedCollection action', () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())
        const getFocusedGranuleMock = jest.spyOn(actions, 'getFocusedGranule').mockImplementation(() => jest.fn())

        const newPath = '/search/granules/granule-details?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          focusedGranule: 'G00001-EDSC',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          providers: [],
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
        expect(getFocusedGranuleMock).toBeCalledTimes(1)
      })
    })
  })

  describe('when a portal path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getFocusedCollection action', () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/portal/fakeportal/search/granules?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          providers: [],
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getFocusedCollection action', () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/portal/fakeportal/search/granules/collection-details?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          providers: [],
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getFocusedCollection action', () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/portal/fakeportal/search/granules/subscriptions?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          providers: [],
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getFocusedCollection action', () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())
        const getFocusedGranuleMock = jest.spyOn(actions, 'getFocusedGranule').mockImplementation(() => jest.fn())

        const newPath = '/portal/fakeportal/search/granules/granule-details?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          focusedGranule: 'G00001-EDSC',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          providers: [],
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
        expect(getFocusedGranuleMock).toBeCalledTimes(1)
      })
    })
  })
})

describe('changeUrl', () => {
  describe('when called with a string', () => {
    describe('when called without a projectId', () => {
      test('calls replace when the pathname has not changed', () => {
        const newPath = '/search?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          router: {
            location: {
              pathname: '/search'
            }
          },
          savedProject: {}
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          payload: {
            args: [
              newPath
            ],
            method: 'replace'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        })
      })

      test('calls push when the pathname has changed', () => {
        const newPath = '/search/granules?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          router: {
            location: {
              pathname: '/search'
            }
          },
          savedProject: {}
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          payload: {
            args: [
              newPath
            ],
            method: 'push'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        })
      })
    })

    describe('when called with a projectId', () => {
      test('updates the stored path', async () => {
        nock(/localhost/)
          .post(/projects/)
          .reply(200, {
            project_id: 1,
            path: '/search?p=C00001-EDSC'
          })

        const newPath = '/search?p=C00001-EDSC&ff=Map%20Imagery'

        const store = mockStore({
          query: {},
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        await store.dispatch(urlQuery.changeUrl(newPath)).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            payload: {
              projectId: 1,
              path: '/search?p=C00001-EDSC'
            },
            type: UPDATE_SAVED_PROJECT
          })
        })
      })

      test('updates the url if a new projectId was created', async () => {
        nock(/localhost/)
          .post(/projects/)
          .reply(200, {
            project_id: 2,
            path: '/search?p=C00001-EDSC'
          })

        const newPath = '/search?p=C00001-EDSC&ff=Map%20Imagery'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        await store.dispatch(urlQuery.changeUrl(newPath)).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            payload: {
              args: [
                '/search?projectId=2'
              ],
              method: 'replace'
            },
            type: '@@router/CALL_HISTORY_METHOD'
          })
          expect(storeActions[1]).toEqual({
            payload: {
              projectId: 2,
              path: '/search?p=C00001-EDSC'
            },
            type: UPDATE_SAVED_PROJECT
          })
        })
      })

      test('when the path has not changed', () => {
        const newPath = '/search?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions.length).toBe(0)
      })
    })
  })

  describe('when called with an object', () => {
    test('calls replace when the pathname has not changed', () => {
      const newPath = {
        pathname: '/search',
        search: '?p=C00001-EDSC'
      }

      const store = mockStore({
        earthdataEnvironment: 'prod',
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(urlQuery.changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'replace'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = {
        pathname: '/granules',
        search: '?p=C00001-EDSC'
      }

      const store = mockStore({
        earthdataEnvironment: 'prod',
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(urlQuery.changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'push'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })
  })
})
