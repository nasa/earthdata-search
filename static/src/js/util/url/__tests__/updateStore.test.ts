import useEdscStore from '../../../zustand/useEdscStore'
import { updateStore, type UpdateStoreParams } from '../updateStore'
import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import routerHelper from '../../../router/router'

describe('updateStore', () => {
  test('sets the zustand state', async () => {
    const params = {
      cmrFacets: {},
      deprecatedUrlParams: [],
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
          byId: {},
          isLoading: false
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
    } as unknown as UpdateStoreParams

    await updateStore(params)

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
        byId: {},
        isLoading: false
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
    test('sets the zustand state', async () => {
      const params = {
        cmrFacets: {},
        deprecatedUrlParams: [],
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
            byId: {},
            isLoading: false
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
      } as unknown as UpdateStoreParams

      await updateStore(params, '/projects')

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
          allIds: ['C00001-EDSC'],
          byId: {},
          isLoading: false
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
      vi.mock('../../../../../portals/testPortal/styles.scss', () => ({
        unuse: vi.fn(),
        use: vi.fn()
      }))

      const params = {
        cmrFacets: {},
        deprecatedUrlParams: [],
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
      } as unknown as UpdateStoreParams

      await updateStore(params, '/projects')

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

      expect(project).toEqual(expect.objectContaining({
        collections: {
          allIds: [],
          byId: {},
          isLoading: false
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
        } as unknown as UpdateStoreParams

        routerHelper.router!.state = {
          location: {
            pathname: '/',
            search: ''
          }
        }

        await updateStore(params)

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
