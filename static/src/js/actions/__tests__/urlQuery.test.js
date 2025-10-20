import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import { RESTORE_FROM_URL } from '../../constants/actionTypes'

import * as urlQuery from '../urlQuery'
import useEdscStore from '../../zustand/useEdscStore'
import { collectionSortKeys } from '../../constants/collectionSortKeys'
import { initialState as initialQueryState } from '../../zustand/slices/createQuerySlice'

import routerHelper from '../../router/router'
import { initialGranuleQuery } from '../../util/url/collectionsEncoders'
import getApolloClient from '../../providers/getApolloClient'

jest.mock('../../providers/getApolloClient', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    query: jest.fn().mockResolvedValue({
      data: {
        project: {
          obfuscatedId: '1',
          name: null,
          path: '/search?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
        }
      }
    })
  })
}))

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

    const store = mockStore()

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
        onlyEosdisCollections: false,
        overrideTemporal: {},
        pageNum: 1,
        sortKey: collectionSortKeys.scoreDescending,
        spatial: initialState.query.collection.spatial,
        tagKey: '',
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

      const store = mockStore()
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
          onlyEosdisCollections: false,
          overrideTemporal: {},
          pageNum: 1,
          sortKey: collectionSortKeys.scoreDescending,
          spatial: initialState.query.collection.spatial,
          tagKey: '',
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

      const store = mockStore()
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
          onlyEosdisCollections: false,
          overrideTemporal: {},
          pageNum: 1,
          sortKey: collectionSortKeys.scoreDescending,
          spatial: initialState.query.collection.spatial,
          tagKey: '',
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

    describe('when only portalId is provided on the root path', () => {
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

        routerHelper.router.state = {
          location: {
            pathname: '/',
            search: ''
          }
        }

        const store = mockStore()

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
    const mockQuery = jest.fn().mockResolvedValue({
      data: {
        project: {
          name: 'Test Project',
          obfuscatedId: '12345',
          path: '/search/granules?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
        }
      }
    })

    getApolloClient.mockReturnValue({
      query: mockQuery
    })

    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())

    useEdscStore.setState((state) => {
      /* eslint-disable no-param-reassign */
      state.collections.getCollections = jest.fn()

      state.project.collections.allIds = ['C00001-EDSC']
      state.project.getProjectCollections = jest.fn()
      state.project.getProjectGranules = jest.fn()

      state.timeline.getTimeline = jest.fn()
      /* eslint-enable no-param-reassign */
    })

    const newPath = '/search?projectId=12345'

    const store = mockStore()

    await store.dispatch(urlQuery.changePath(newPath)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions.length).toBe(0)

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
                  isVisible: true,
                  selectedAccessMethod: undefined
                }
              }
            }
          },
          query: {
            collection: {
              byId: {
                'C00001-EDSC': {
                  granules: initialGranuleQuery
                }
              },
              hasGranulesOrCwic: true,
              overrideTemporal: {},
              pageNum: 1,
              spatial: initialQueryState.collection.spatial,
              temporal: {}
            },
            nlpCollection: null
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
        savedProject,
        timeline
      } = zustandState

      expect(savedProject.project).toEqual({
        id: '12345',
        name: 'Test Project',
        path: '/search/granules?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
      })

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
      savedProject: {
        setProject: jest.fn()
      },
      timeline: {
        getTimeline: jest.fn()
      }
    })

    const newPath = '/search?p=C00001-EDSC'

    const store = mockStore()

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
              granules: initialGranuleQuery
            }
          },
          hasGranulesOrCwic: true,
          overrideTemporal: {},
          pageNum: 1,
          spatial: initialQueryState.collection.spatial,
          temporal: {}
        },
        nlpCollection: null
      },
      shapefile: {
        shapefileId: ''
      }
    }), '/search')

    const zustandState = useEdscStore.getState()
    const {
      collections,
      savedProject,
      timeline
    } = zustandState

    expect(savedProject.setProject).toHaveBeenCalledTimes(0)

    expect(collections.getCollections).toHaveBeenCalledTimes(1)
    expect(collections.getCollections).toHaveBeenCalledWith()

    expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
    expect(timeline.getTimeline).toHaveBeenCalledWith()
  })

  describe('when a path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/search/granules?p=C00001-EDSC'

        const store = mockStore()

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

        const store = mockStore()

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

        const store = mockStore()

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

        const store = mockStore()

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

        const store = mockStore()

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

        const store = mockStore()

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

        const store = mockStore()

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

        const store = mockStore()

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
})

describe('changeUrl', () => {
  describe('when called with a string', () => {
    beforeEach(() => {
      routerHelper.router.state = {
        location: {
          pathname: '/search',
          search: '?p=C00001-EDSC'
        }
      }
    })

    test('calls replace when the pathname has not changed', () => {
      const newPath = '/search?p=C00001-EDSC'

      const store = mockStore()

      store.dispatch(urlQuery.changeUrl(newPath))

      expect(routerHelper.router.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router.navigate).toHaveBeenCalledWith(newPath, { replace: true })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = '/search/granules?p=C00001-EDSC'

      const store = mockStore()

      store.dispatch(urlQuery.changeUrl(newPath))

      expect(routerHelper.router.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router.navigate).toHaveBeenCalledWith(newPath)
    })
  })

  describe('when called with an object', () => {
    test('calls replace when the pathname has not changed', () => {
      const newPath = {
        pathname: '/search',
        search: '?p=C00001-EDSC'
      }

      routerHelper.router.state = {
        location: {
          pathname: '/search',
          search: ''
        }
      }

      const store = mockStore()

      store.dispatch(urlQuery.changeUrl(newPath))

      expect(routerHelper.router.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router.navigate).toHaveBeenCalledWith(newPath, { replace: true })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = {
        pathname: '/granules',
        search: '?p=C00001-EDSC'
      }

      routerHelper.router.state = {
        location: {
          pathname: '/search',
          search: ''
        }
      }

      const store = mockStore()

      store.dispatch(urlQuery.changeUrl(newPath))

      expect(routerHelper.router.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router.navigate).toHaveBeenCalledWith(newPath)
    })
  })
})
