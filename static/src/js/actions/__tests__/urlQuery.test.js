import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import { UPDATE_SAVED_PROJECT, RESTORE_FROM_URL } from '../../constants/actionTypes'

import * as urlQuery from '../urlQuery'
import useEdscStore from '../../zustand/useEdscStore'
import { collectionSortKeys } from '../../constants/collectionSortKeys'
import { initialState as initialQueryState } from '../../zustand/slices/createQuerySlice'
import * as urlUtils from '../../util/url/url'

const mockStore = configureMockStore([thunk])

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
      focusedGranule: 'G00001-EDSC',
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
      selectedRegion: {},
      timeline: {
        query: {
          center: 1676443651000,
          interval: 'month'
        }
      }
    }

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
        cmrFacets: undefined,
        earthdataEnvironment: undefined,
        featureFacets: undefined,
        focusedCollection: undefined,
        focusedGranule: undefined,
        mapView: undefined,
        portal: undefined,
        project: undefined,
        query: undefined,
        selectedRegion: undefined,
        timeline: undefined
      },
      type: RESTORE_FROM_URL
    })

    // Expect the zustand store to be updated
    const initialState = useEdscStore.getInitialState()
    const {
      earthdataEnvironment,
      facetParams,
      collection,
      granule,
      map,
      portal,
      project,
      query,
      timeline
    } = useEdscStore.getState()

    expect(earthdataEnvironment).toEqual({
      currentEnvironment: 'prod'
    })

    expect(facetParams).toEqual({
      ...initialState.facetParams,
      cmrFacets: {},
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false
      }
    })

    expect(collection).toEqual({
      ...initialState.collection,
      collectionId: 'C00001-EDSC'
    })

    expect(granule).toEqual({
      ...initialState.granule,
      granuleId: 'G00001-EDSC'
    })

    expect(map).toEqual(initialState.map)

    expect(portal).toEqual({})

    expect(project).toEqual(expect.objectContaining({
      collections: {
        allIds: [],
        byId: {}
      }
    }))

    expect(query).toEqual({
      ...initialState.query,
      collection: {
        byId: {},
        keyword: '',
        overrideTemporal: {},
        pageNum: 1,
        sortKey: collectionSortKeys.scoreDescending,
        spatial: initialState.query.collection.spatial,
        temporal: {}
      },
      selectedRegion: {}
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
        focusedGranule: 'G00001-EDSC',
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
          }
        },
        selectedRegion: {},
        timeline: {
          query: {
            center: 1676443651000,
            interval: 'month'
          }
        }
      }

      const initialState = useEdscStore.getInitialState()
      const getTimelineMock = jest.fn()
      useEdscStore.setState({
        ...initialState,
        project: {
          getProjectCollections: jest.fn()
        },
        timeline: {
          ...initialState.timeline,
          getTimeline: getTimelineMock
        }
      })

      const store = mockStore({
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
          cmrFacets: undefined,
          earthdataEnvironment: undefined,
          featureFacets: undefined,
          focusedCollection: undefined,
          focusedGranule: undefined,
          mapView: undefined,
          portal: undefined,
          project: undefined,
          query: undefined,
          selectedRegion: undefined,
          timeline: undefined
        },
        type: RESTORE_FROM_URL
      })

      expect(getTimelineMock).toHaveBeenCalledTimes(0)

      // Expect the zustand store to be updated
      const {
        earthdataEnvironment,
        facetParams,
        collection,
        granule,
        map,
        portal,
        project,
        query,
        timeline
      } = useEdscStore.getState()

      expect(earthdataEnvironment).toEqual({
        currentEnvironment: 'prod'
      })

      expect(facetParams).toEqual({
        ...initialState.facetParams,
        cmrFacets: {},
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false
        }
      })

      expect(collection).toEqual({
        ...initialState.collection,
        collectionId: 'C00001-EDSC'
      })

      expect(granule).toEqual({
        ...initialState.granule,
        granuleId: 'G00001-EDSC'
      })

      expect(map).toEqual(initialState.map)

      expect(portal).toEqual({})

      expect(project).toEqual(expect.objectContaining({
        collections: {
          allIds: ['C00001-EDSC'],
          byId: {}
        }
      }))

      expect(query).toEqual({
        ...initialState.query,
        collection: {
          byId: {},
          keyword: '',
          overrideTemporal: {},
          pageNum: 1,
          sortKey: collectionSortKeys.scoreDescending,
          spatial: initialState.query.collection.spatial,
          temporal: {}
        },
        selectedRegion: {}
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
        focusedCollection: null,
        focusedGranule: '',
        mapView: {},
        portalId: 'testPortal',
        project: {},
        query: {
          collection: {
            overrideTemporal: {},
            pageNum: 1,
            spatial: {},
            temporal: {}
          }
        },
        selectedRegion: {},
        timeline: {
          query: {
            center: 1676443651000,
            interval: 'month'
          }
        }
      }

      const initialState = useEdscStore.getInitialState()
      const getTimelineMock = jest.fn()
      useEdscStore.setState({
        ...initialState,
        project: {
          getProjectCollections: jest.fn()
        },
        timeline: {
          ...initialState.timeline,
          getTimeline: getTimelineMock
        }
      })

      const store = mockStore({
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
          cmrFacets: undefined,
          earthdataEnvironment: undefined,
          featureFacets: undefined,
          focusedCollection: undefined,
          focusedGranule: undefined,
          mapView: undefined,
          portalId: undefined,
          portal: undefined,
          project: undefined,
          query: undefined,
          selectedRegion: undefined,
          timeline: undefined
        },
        type: RESTORE_FROM_URL
      })

      expect(getTimelineMock).toHaveBeenCalledTimes(0)

      // Expect the zustand store to be updated
      const {
        earthdataEnvironment,
        facetParams,
        collection,
        granule,
        map,
        portal,
        project,
        query,
        timeline
      } = useEdscStore.getState()

      expect(earthdataEnvironment).toEqual({
        currentEnvironment: 'prod'
      })

      expect(facetParams).toEqual({
        ...initialState.facetParams,
        cmrFacets: {},
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false
        }
      })

      expect(collection).toEqual({
        ...initialState.collection,
        collectionId: null
      })

      expect(granule).toEqual({
        ...initialState.granule,
        granuleId: ''
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

      expect(project).toEqual({
        getProjectCollections: expect.any(Function)
      })

      expect(query).toEqual({
        ...initialState.query,
        collection: {
          byId: {},
          keyword: '',
          overrideTemporal: {},
          pageNum: 1,
          sortKey: collectionSortKeys.scoreDescending,
          spatial: initialState.query.collection.spatial,
          temporal: {}
        },
        selectedRegion: {}
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

    describe('when loadFromUrl is false and no newPathname', () => {
      test('only loads portal config', async () => {
        const params = {
          cmrFacets: {},
          earthdataEnvironment: 'prod',
          featureFacets: {
            availableInEarthdataCloud: false,
            customizable: false,
            mapImagery: false
          },
          focusedCollection: 'C00001-EDSC',
          focusedGranule: 'G00001-EDSC',
          mapView: {},
          portalId: 'testPortal',
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

        const store = mockStore({
          router: {
            location: {
              pathname: '/'
            }
          }
        })

        await store.dispatch(urlQuery.updateStore(params))

        const storeActions = store.getActions()
        expect(storeActions.length).toBe(0)

        // Expect only portal config to be loaded in zustand store
        const { portal } = useEdscStore.getState()

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

    useEdscStore.setState({
      collections: {
        getCollections: jest.fn()
      },
      project: {
        collections: {
          allIds: ['C00001-EDSC']
        },
        getProjectCollections: jest.fn(),
        getProjectGranules: jest.fn()
      },
      timeline: {
        getTimeline: jest.fn()
      }
    })

    const newPath = '/search?projectId=1'

    const store = mockStore({
      metadata: {
        collections: {
          'C00001-EDSC': {
            services: [],
            variables: []
          }
        },
        granules: {}
      },
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
              spatial: initialQueryState.collection.spatial,
              temporal: {}
            }
          },
          shapefile: {
            shapefileId: ''
          }
        })
      )

      const zustandState = useEdscStore.getState()
      const {
        collections,
        project,
        timeline
      } = zustandState

      expect(collections.getCollections).toHaveBeenCalledTimes(1)
      expect(collections.getCollections).toHaveBeenCalledWith()

      expect(project.getProjectCollections).toHaveBeenCalledTimes(1)
      expect(project.getProjectCollections).toHaveBeenCalledWith()

      expect(project.getProjectGranules).toHaveBeenCalledTimes(1)
      expect(project.getProjectGranules).toHaveBeenCalledWith()

      expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
      expect(timeline.getTimeline).toHaveBeenCalledWith()
    })
  })

  test('updates the store if there is not a projectId', async () => {
    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())

    useEdscStore.setState({
      collections: {
        getCollections: jest.fn()
      },
      timeline: {
        getTimeline: jest.fn()
      }
    })

    const newPath = '/search?p=C00001-EDSC'

    const store = mockStore({
      router: {
        location: {
          pathname: '/search'
        }
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
                pageNum: 1,
                sortKey: '-start_date'
              }
            }
          },
          hasGranulesOrCwic: true,
          overrideTemporal: {},
          pageNum: 1,
          spatial: initialQueryState.collection.spatial,
          temporal: {}
        }
      },
      shapefile: {
        shapefileId: ''
      }
    }), '/search')

    const zustandState = useEdscStore.getState()
    const {
      collections,
      timeline
    } = zustandState

    expect(collections.getCollections).toHaveBeenCalledTimes(1)
    expect(collections.getCollections).toHaveBeenCalledWith()

    expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
    expect(timeline.getTimeline).toHaveBeenCalledWith()
  })

  test('handles an error fetching the project', async () => {
    nock(/localhost/)
      .get(/projects/)
      .reply(500, { mock: 'error' })

    const handleErrorMock = jest.spyOn(actions, 'handleError').mockImplementation(() => jest.fn())

    useEdscStore.setState({
      collections: {
        getCollections: jest.fn()
      },
      timeline: {
        getTimeline: jest.fn()
      }
    })

    const newPath = '/search?projectId=1'

    const store = mockStore({
      metadata: {
        collections: {
          'C00001-EDSC': {
            services: [],
            variables: []
          }
        },
        granules: {}
      },
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    await store.dispatch(urlQuery.changePath(newPath)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions.length).toEqual(0)

      const zustandState = useEdscStore.getState()
      const {
        collections,
        timeline
      } = zustandState

      expect(collections.getCollections).toHaveBeenCalledTimes(1)
      expect(collections.getCollections).toHaveBeenCalledWith()

      expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
      expect(timeline.getTimeline).toHaveBeenCalledWith()

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
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/search/granules?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState({
          collection: {
            getCollectionMetadata: jest.fn()
          },
          collections: {
            getCollections: jest.fn()
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        const { collection, collections } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/search/granules/collection-details?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState({
          collection: {
            getCollectionMetadata: jest.fn()
          },
          collections: {
            getCollections: jest.fn()
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        const { collection, collections } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/search/granules/subscriptions?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState({
          collection: {
            getCollectionMetadata: jest.fn()
          },
          collections: {
            getCollections: jest.fn()
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        const { collection, collections } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getCollectionMetadata and getGranuleMetadata', async () => {
        const newPath = '/search/granules/granule-details?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState({
          collection: {
            getCollectionMetadata: jest.fn()
          },
          collections: {
            getCollections: jest.fn()
          },
          granule: {
            getGranuleMetadata: jest.fn()
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(granule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })
  })

  describe('when a portal path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/portal/fakeportal/search/granules?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState({
          collection: {
            getCollectionMetadata: jest.fn()
          },
          collections: {
            getCollections: jest.fn()
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        const { collection, collections } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/portal/fakeportal/search/granules/collection-details?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState({
          collection: {
            getCollectionMetadata: jest.fn()
          },
          collections: {
            getCollections: jest.fn()
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        const { collection, collections } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/portal/fakeportal/search/granules/subscriptions?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState({
          collection: {
            getCollectionMetadata: jest.fn()
          },
          collections: {
            getCollections: jest.fn()
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        const { collection, collections } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getCollectionMetadata and getGranuleMetadata', async () => {
        const newPath = '/portal/fakeportal/search/granules/granule-details?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState({
          collection: {
            getCollectionMetadata: jest.fn()
          },
          collections: {
            getCollections: jest.fn()
          },
          granule: {
            getGranuleMetadata: jest.fn()
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(granule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })
  })

  describe('when nlpSearchCompleted is true', () => {
    test('skips calling getCollections', async () => {
      const getCollectionsMock = jest.fn()
      useEdscStore.setState({
        collections: {
          getCollections: getCollectionsMock
        },
        query: {
          nlpSearchCompleted: true
        },
        timeline: {
          getTimeline: jest.fn()
        }
      })

      const newPath = '/search?p=C00001-EDSC'

      const store = mockStore({
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      await store.dispatch(urlQuery.changePath(newPath))

      expect(getCollectionsMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('when NLP search is requested', () => {
    test('handles NLP search with query parameter', async () => {
      const changeQueryMock = jest.fn()
      const getCollectionsMock = jest.fn()
      const getNlpCollectionsMock = jest.fn()

      const decodeUrlParamsSpy = jest.spyOn(urlUtils, 'decodeUrlParams')
      decodeUrlParamsSpy.mockReturnValue({
        query: {
          collection: {
            keyword: 'test-keyword'
          }
        }
      })

      useEdscStore.setState({
        collections: {
          getCollections: getCollectionsMock,
          getNlpCollections: getNlpCollectionsMock
        },
        query: {
          changeQuery: changeQueryMock,
          nlpSearchCompleted: false
        },
        timeline: {
          getTimeline: jest.fn()
        }
      })

      const newPath = '/search?nlp=true&q=climate+data'

      const store = mockStore({
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      await store.dispatch(urlQuery.changePath(newPath))

      expect(changeQueryMock).toHaveBeenCalledWith({
        collection: {
          keyword: 'climate data'
        },
        skipCollectionSearch: true
      })

      expect(getNlpCollectionsMock).toHaveBeenCalledWith('climate data')
      expect(decodeUrlParamsSpy).toHaveBeenCalledWith('nlp=true&q=climate+data')

      decodeUrlParamsSpy.mockRestore()
    })
  })
})

describe('changeUrl', () => {
  describe('when called with a string', () => {
    describe('when called without a projectId', () => {
      test('calls replace when the pathname has not changed', () => {
        const newPath = '/search?p=C00001-EDSC'

        const store = mockStore({
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
