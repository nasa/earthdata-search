import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import { UPDATE_SAVED_PROJECT, RESTORE_FROM_URL } from '../../constants/actionTypes'

import * as urlQuery from '../urlQuery'
import useEdscStore from '../../zustand/useEdscStore'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('updateStore', () => {
  test('calls restoreFromUrl and gets new search results', async () => {
    const params = {
      cmrFacets: {},
      earthdataEnvironment: 'prod',
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false
      },
      focusedCollection: 'C00001-EDSC',
      mapView: {},
      portal: {},
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
      timeline: {
        query: {
          center: 1676443651000,
          interval: 'month'
        }
      }
    }

    useEdscStore.setState((state) => ({
      ...state,
      preferences: {
        ...state.preferences,
        preferences: {
          ...state.preferences.preferences,
          collectionSort: 'default'
        }
      }
    }))

    const store = mockStore({
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    await store.dispatch(urlQuery.updateStore(params))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        ...params,
        query: {
          ...params.query,
          collectionSortPreference: 'default'
        },
        cmrFacets: undefined,
        featureFacets: undefined,
        mapView: undefined,
        portal: undefined,
        timeline: undefined
      },
      type: RESTORE_FROM_URL
    })

    // Expect the zustand store to be updated
    const initialState = useEdscStore.getInitialState()
    const {
      facetParams,
      map,
      portal,
      timeline
    } = useEdscStore.getState()

    expect(facetParams).toEqual({
      ...initialState.facetParams,
      cmrFacets: {},
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false
      }
    })

    expect(map).toEqual(initialState.map)

    expect(portal).toEqual({})

    expect(timeline).toEqual({
      intervals: {},
      query: {
        center: 1676443651000,
        interval: 'month'
      },
      setQuery: expect.any(Function),
      getTimeline: expect.any(Function)
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
          mapImagery: false
        },
        focusedCollection: 'C00001-EDSC',
        mapView: {},
        portal: {},
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
        timeline: {
          query: {
            center: 1676443651000,
            interval: 'month'
          }
        }
      }

      jest.spyOn(actions, 'getProjectCollections').mockImplementation(() => jest.fn())

      const initialState = useEdscStore.getInitialState()
      const getTimelineMock = jest.fn()
      useEdscStore.setState({
        ...initialState,
        timeline: {
          ...initialState.timeline,
          getTimeline: getTimelineMock
        }
      })

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
          advancedSearch: undefined,
          collections: undefined,
          earthdataEnvironment: 'prod',
          focusedCollection: 'C00001-EDSC',
          focusedGranule: undefined,
          deprecatedUrlParams: undefined,
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
            granule: { pageNum: 1 },
            collectionSortPreference: 'default'
          }
        },
        type: RESTORE_FROM_URL
      })

      expect(getTimelineMock).toHaveBeenCalledTimes(0)

      // Expect the zustand store to be updated
      const {
        facetParams,
        map,
        portal,
        timeline
      } = useEdscStore.getState()

      expect(facetParams).toEqual({
        ...initialState.facetParams,
        cmrFacets: {},
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false
        }
      })

      expect(map).toEqual(initialState.map)

      expect(portal).toEqual({})

      expect(timeline).toEqual({
        intervals: {},
        query: {
          center: 1676443651000,
          interval: 'month'
        },
        setQuery: expect.any(Function),
        getTimeline: expect.any(Function)
      })
    })
  })

  describe('when a portal parameter is provided', () => {
    test('loads the included styles', async () => {
      jest.mock('../../../../../portals/testPortal/styles.scss', () => ({
        unuse: jest.fn(),
        use: jest.fn()
      }))

      const params = {
        cmrFacets: {},
        earthdataEnvironment: 'prod',
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false
        },
        focusedCollection: '',
        mapView: {},
        portalId: 'testPortal',
        project: {},
        query: {
          collection: {
            overrideTemporal: {},
            pageNum: 1,
            spatial: {},
            temporal: {}
          },
          granule: { pageNum: 1 }
        },
        timeline: {
          query: {
            center: 1676443651000,
            interval: 'month'
          }
        }
      }

      jest.spyOn(actions, 'getProjectCollections').mockImplementation(() => jest.fn())

      const initialState = useEdscStore.getInitialState()
      const getTimelineMock = jest.fn()
      useEdscStore.setState({
        ...initialState,
        timeline: {
          ...initialState.timeline,
          getTimeline: getTimelineMock
        }
      })

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
          advancedSearch: undefined,
          collections: undefined,
          earthdataEnvironment: 'prod',
          focusedCollection: '',
          focusedGranule: undefined,
          deprecatedUrlParams: undefined,
          project: {},
          query: {
            collection: {
              overrideTemporal: {},
              pageNum: 1,
              spatial: {},
              temporal: {}
            },
            granule: { pageNum: 1 },
            collectionSortPreference: 'default'
          }
        },
        type: RESTORE_FROM_URL
      })

      expect(getTimelineMock).toHaveBeenCalledTimes(0)

      // Expect the zustand store to be updated
      const {
        facetParams,
        map,
        portal,
        timeline
      } = useEdscStore.getState()

      expect(facetParams).toEqual({
        ...initialState.facetParams,
        cmrFacets: {},
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false
        }
      })

      expect(map).toEqual(initialState.map)

      expect(portal).toEqual({
        features: {
          advancedSearch: true,
          authentication: true,
          featureFacets: {
            showAvailableInEarthdataCloud: true,
            showCustomizable: true,
            showMapImagery: true
          }
        },
        footer: {
          attributionText: 'NASA Official: Test Official',
          displayVersion: true,
          primaryLinks: [{
            href: 'http://www.nasa.gov/FOIA/index.html',
            title: 'FOIA'
          }, {
            href: 'http://www.nasa.gov/about/highlights/HP_Privacy.html',
            title: 'NASA Privacy Policy'
          }, {
            href: 'http://www.usa.gov',
            title: 'USA.gov'
          }],
          secondaryLinks: [{
            href: 'https://access.earthdata.nasa.gov/',
            title: 'Earthdata Access: A Section 508 accessible alternative'
          }]
        },
        moreInfoUrl: 'https://test.gov',
        pageTitle: 'TEST',
        parentConfig: 'edsc',
        portalBrowser: true,
        portalId: 'testPortal',
        query: {
          hasGranulesOrCwic: null,
          project: 'testProject'
        },
        title: {
          primary: 'test',
          secondary: 'test secondary title'
        },
        ui: {
          showNonEosdisCheckbox: false,
          showOnlyGranulesCheckbox: false,
          showTophat: true
        }
      })

      expect(timeline).toEqual({
        intervals: {},
        query: {
          center: 1676443651000,
          interval: 'month'
        },
        setQuery: expect.any(Function),
        getTimeline: expect.any(Function)
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

    const getTimelineMock = jest.fn()
    useEdscStore.setState({
      timeline: {
        getTimeline: getTimelineMock
      }
    })

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

      expect(updateStoreMock).toHaveBeenCalledTimes(1)
      expect(updateStoreMock).toHaveBeenCalledWith(
        expect.objectContaining({
          featureFacets: {
            availableInEarthdataCloud: false,
            customizable: false,
            mapImagery: false
          },
          deprecatedUrlParams: [],
          focusedCollection: 'C00001-EDSC',
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

      expect(getCollectionsMock).toHaveBeenCalledTimes(1)
      expect(getProjectCollectionsMock).toHaveBeenCalledTimes(1)
      expect(getProjectGranulesMock).toHaveBeenCalledTimes(1)
      expect(getTimelineMock).toHaveBeenCalledTimes(1)
    })
  })

  test('updates the store if there is not a projectId', async () => {
    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())
    const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())

    const getTimelineMock = jest.fn()
    useEdscStore.setState({
      timeline: {
        getTimeline: getTimelineMock
      }
    })

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

    await store.dispatch(urlQuery.changePath(newPath))

    expect(updateStoreMock).toHaveBeenCalledTimes(1)
    expect(updateStoreMock).toHaveBeenCalledWith(expect.objectContaining({
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false
      },
      focusedCollection: 'C00001-EDSC',
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
    }), '/search')

    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
    expect(getTimelineMock).toHaveBeenCalledTimes(1)
  })

  test('handles an error fetching the project', async () => {
    nock(/localhost/)
      .get(/projects/)
      .reply(500, { mock: 'error' })

    const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
    const handleErrorMock = jest.spyOn(actions, 'handleError').mockImplementation(() => jest.fn())
    const getTimelineMock = jest.fn()
    useEdscStore.setState({
      timeline: {
        getTimeline: getTimelineMock
      }
    })

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
      expect(storeActions.length).toEqual(0)

      expect(getCollectionsMock).toHaveBeenCalledTimes(1)
      expect(getTimelineMock).toHaveBeenCalledTimes(1)

      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
        action: 'changePath',
        error: new Error('Request failed with status code 500'),
        resource: 'project',
        verb: 'updating'
      }))
    })
  })

  describe('when a path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getFocusedCollection action', async () => {
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

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toHaveBeenCalledTimes(1)
        expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getFocusedCollection action', async () => {
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

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toHaveBeenCalledTimes(1)
        expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getFocusedCollection action', async () => {
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

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toHaveBeenCalledTimes(1)
        expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getFocusedCollection action', async () => {
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

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toHaveBeenCalledTimes(1)
        expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
        expect(getFocusedGranuleMock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when a portal path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getFocusedCollection action', async () => {
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

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toHaveBeenCalledTimes(1)
        expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getFocusedCollection action', async () => {
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

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toHaveBeenCalledTimes(1)
        expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getFocusedCollection action', async () => {
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

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toHaveBeenCalledTimes(1)
        expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getFocusedCollection action', async () => {
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

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toHaveBeenCalledTimes(1)
        expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
        expect(getFocusedGranuleMock).toHaveBeenCalledTimes(1)
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

      test('handles an error updating the stored path', async () => {
        nock(/localhost/)
          .post(/projects/)
          .reply(500, { mock: 'error' })

        const handleErrorMock = jest.spyOn(actions, 'handleError').mockImplementation(() => jest.fn())

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
          expect(storeActions.length).toEqual(0)
        })

        expect(handleErrorMock).toHaveBeenCalledTimes(1)
        expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
          action: 'changeUrl',
          error: new Error('Request failed with status code 500'),
          resource: 'project',
          verb: 'updating'
        }))
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
