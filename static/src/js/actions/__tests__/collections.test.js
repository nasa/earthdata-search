import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  getCollections,
  onCollectionsErrored,
  onCollectionsLoaded,
  onCollectionsLoading,
  onFacetsErrored,
  onFacetsLoaded,
  onFacetsLoading,
  updateCollectionResults,
  updateFacets
} from '../collections'

import {
  ADD_MORE_COLLECTION_RESULTS,
  ERRORED_COLLECTIONS,
  ERRORED_FACETS,
  FINISHED_COLLECTIONS_TIMER,
  LOADED_COLLECTIONS,
  LOADED_FACETS,
  LOADING_COLLECTIONS,
  LOADING_FACETS,
  STARTED_COLLECTIONS_TIMER,
  UPDATE_COLLECTION_METADATA,
  UPDATE_COLLECTION_RESULTS,
  UPDATE_FACETS
} from '../../constants/actionTypes'
import useEdscStore from '../../zustand/useEdscStore'

const mockStore = configureMockStore([thunk])

describe('updateCollectionResults', () => {
  test('should create an action to update the search query', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_COLLECTION_RESULTS,
      payload
    }
    expect(updateCollectionResults(payload)).toEqual(expectedAction)
  })
})

describe('onCollectionsLoading', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: LOADING_COLLECTIONS
    }
    expect(onCollectionsLoading()).toEqual(expectedAction)
  })
})

describe('onCollectionsLoaded', () => {
  test('should create an action to update the search query', () => {
    const payload = { loaded: true }
    const expectedAction = {
      type: LOADED_COLLECTIONS,
      payload
    }
    expect(onCollectionsLoaded(payload)).toEqual(expectedAction)
  })
})

describe('onCollectionsErrored', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: ERRORED_COLLECTIONS
    }
    expect(onCollectionsErrored()).toEqual(expectedAction)
  })
})

describe('updateFacets', () => {
  test('should create an action to update the search query', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_FACETS,
      payload
    }
    expect(updateFacets(payload)).toEqual(expectedAction)
  })
})

describe('onFacetsLoading', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: LOADING_FACETS
    }
    expect(onFacetsLoading()).toEqual(expectedAction)
  })
})

describe('onFacetsLoaded', () => {
  test('should create an action to update the search query', () => {
    const payload = { loaded: true }
    const expectedAction = {
      type: LOADED_FACETS,
      payload
    }
    expect(onFacetsLoaded(payload)).toEqual(expectedAction)
  })
})

describe('onFacetsErrored', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: ERRORED_FACETS
    }
    expect(onFacetsErrored()).toEqual(expectedAction)
  })
})

describe('getCollections', () => {
  test('calls the API to get collections', async () => {
    nock(/cmr/)
      .post(/collections/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
          title: 'ECHO dataset metadata',
          entry: [{
            mockCollectionData: 'goes here'
          }],
          facets: {}
        }
      }, {
        'cmr-hits': 1
      })

    // MockStore with initialState
    const store = mockStore({
      authToken: '',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        viewAllFacets: {}
      }
    })

    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.query.collection = {
        pageNum: 1,
        keyword: 'search keyword'
      }
    })

    // Call the dispatch
    await store.dispatch(getCollections()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_COLLECTION_RESULTS,
        payload: {
          results: []
        }
      })

      expect(storeActions[1]).toEqual({ type: LOADING_COLLECTIONS })
      expect(storeActions[2]).toEqual({ type: LOADING_FACETS })
      expect(storeActions[3]).toEqual({ type: STARTED_COLLECTIONS_TIMER })
      expect(storeActions[4]).toEqual({ type: FINISHED_COLLECTIONS_TIMER })
      expect(storeActions[5]).toEqual({
        type: LOADED_COLLECTIONS,
        payload: { loaded: true }
      })

      expect(storeActions[6]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: [{
          mockCollectionData: 'goes here'
        }]
      })

      expect(storeActions[7]).toEqual({
        type: UPDATE_COLLECTION_RESULTS,
        payload: {
          keyword: 'search keyword',
          results: [{
            mockCollectionData: 'goes here'
          }],
          facets: [],
          hits: 1
        }
      })

      expect(storeActions[8]).toEqual({
        type: LOADED_FACETS,
        payload: { loaded: true }
      })
    })
  })

  test('calls lambda to get authenticated collections', async () => {
    nock(/localhost/)
      .post(/collections/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
          title: 'ECHO dataset metadata',
          entry: [{
            mockCollectionData: 'goes here'
          }],
          facets: {}
        }
      }, {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    // MockStore with initialState
    const store = mockStore({
      authToken: 'token',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        viewAllFacets: {}
      }
    })

    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.query.collection = {
        keyword: 'search keyword'
      }
    })

    // Call the dispatch
    await store.dispatch(getCollections()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_COLLECTIONS })
      expect(storeActions[1]).toEqual({ type: LOADING_FACETS })
      expect(storeActions[2]).toEqual({ type: STARTED_COLLECTIONS_TIMER })
      expect(storeActions[3]).toEqual({ type: FINISHED_COLLECTIONS_TIMER })
      expect(storeActions[4]).toEqual({
        type: LOADED_COLLECTIONS,
        payload: { loaded: true }
      })

      expect(storeActions[5]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: [{
          mockCollectionData: 'goes here'
        }]
      })

      expect(storeActions[6]).toEqual({
        type: ADD_MORE_COLLECTION_RESULTS,
        payload: {
          keyword: 'search keyword',
          results: [{
            mockCollectionData: 'goes here'
          }],
          facets: [],
          hits: 1
        }
      })

      expect(storeActions[7]).toEqual({
        type: LOADED_FACETS,
        payload: { loaded: true }
      })
    })
  })

  test('does not call updateCollectionResults on error', async () => {
    nock(/cmr/)
      .post(/collections/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: '',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        viewAllFacets: {}
      }
    })

    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.query.collection = {
        keyword: ''
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getCollections()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_COLLECTIONS })
      expect(storeActions[1]).toEqual({ type: LOADING_FACETS })
      expect(storeActions[2]).toEqual({ type: STARTED_COLLECTIONS_TIMER })
      expect(storeActions[3]).toEqual({ type: FINISHED_COLLECTIONS_TIMER })
      expect(storeActions[4]).toEqual({ type: ERRORED_COLLECTIONS })
      expect(storeActions[5]).toEqual({ type: ERRORED_FACETS })
      expect(storeActions[6]).toEqual({
        type: LOADED_COLLECTIONS,
        payload: { loaded: false }
      })

      expect(storeActions[7]).toEqual({
        type: LOADED_FACETS,
        payload: { loaded: false }
      })

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('NLP search integration', () => {
    test('processes NLP search with spatial data and updates shapefile store', async () => {
      nock(/localhost/)
        .post(/nlpSearch/)
        .reply(200, {
          metadata: {
            feed: {
              entry: [{ mockCollectionData: 'nlp result' }]
            }
          },
          queryInfo: {
            spatial: {
              type: 'Polygon',
              coordinates: [[
                [-120, 40],
                [-120, 50],
                [-110, 50],
                [-110, 40],
                [-120, 40]
              ]]
            }
          }
        })

      const store = mockStore({
        authToken: '',
        searchResults: {
          collections: {},
          facets: {},
          granules: {},
          viewAllFacets: {}
        }
      })

      // Set searchSource to 'landing' to trigger NLP search
      const zustandInitialState = useEdscStore.getInitialState()
      useEdscStore.setState({
        ...zustandInitialState,
        query: {
          collection: {
            keyword: 'wildfire data'
          },
          searchSource: 'landing'
        },
        shapefile: {
          file: null,
          isLoaded: false,
          isLoading: false,
          isErrored: false,
          shapefileName: '',
          selectedFeatures: []
        }
      })

      await store.dispatch(getCollections())

      // Verify shapefile store was updated with NLP spatial data
      const zustandState = useEdscStore.getState()
      expect(zustandState.shapefile.file).toEqual({
        type: 'FeatureCollection',
        name: 'NLP Extracted Spatial Area',
        features: [{
          type: 'Feature',
          properties: {
            source: 'nlp',
            query: 'wildfire data',
            edscId: '0'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-120, 40],
              [-120, 50],
              [-110, 50],
              [-110, 40],
              [-120, 40]
            ]]
          }
        }]
      })

      expect(zustandState.shapefile.isLoaded).toBe(true)
      expect(zustandState.shapefile.selectedFeatures).toEqual(['0'])
      expect(zustandState.shapefile.shapefileName).toBe('NLP Spatial Area')

      // Verify searchSource was reset to 'search'
      expect(zustandState.query.searchSource).toBe('search')
    })

    test('processes NLP search with spatial and temporal data', async () => {
      nock(/localhost/)
        .post(/nlpSearch/)
        .reply(200, {
          metadata: {
            feed: {
              entry: [{ mockCollectionData: 'nlp result with temporal' }]
            }
          },
          queryInfo: {
            spatial: {
              type: 'Point',
              coordinates: [-120, 40]
            },
            temporal: {
              startDate: '2020-01-01',
              endDate: '2020-12-31'
            }
          }
        })

      const store = mockStore({
        authToken: '',
        searchResults: {
          collections: {},
          facets: {},
          granules: {},
          viewAllFacets: {}
        }
      })

      const zustandInitialState = useEdscStore.getInitialState()
      useEdscStore.setState({
        ...zustandInitialState,
        query: {
          collection: {
            keyword: 'temperature data 2020',
            temporal: {}
          },
          searchSource: 'landing'
        },
        shapefile: {
          file: null,
          isLoaded: false,
          isLoading: false,
          isErrored: false,
          shapefileName: '',
          selectedFeatures: []
        }
      })

      await store.dispatch(getCollections())

      const zustandState = useEdscStore.getState()

      // Verify both shapefile AND temporal data were updated
      expect(zustandState.shapefile.file).not.toBeNull()
      expect(zustandState.shapefile.file.features[0].properties.edscId).toBe('0')

      expect(zustandState.query.collection.temporal.startDate).toBe('2020-01-01T00:00:00.000Z')
      expect(zustandState.query.collection.temporal.endDate).toBe('2020-12-31T23:59:59.999Z')
      expect(zustandState.query.collection.temporal.isRecurring).toBe(false)
    })

    test('processes NLP search without spatial data (baseline)', async () => {
      nock(/localhost/)
        .post(/nlpSearch/)
        .reply(200, {
          metadata: {
            feed: {
              entry: [{ mockCollectionData: 'nlp result no spatial' }]
            }
          },
          queryInfo: {}
        })

      const store = mockStore({
        authToken: '',
        searchResults: {
          collections: {},
          facets: {},
          granules: {},
          viewAllFacets: {}
        }
      })

      const zustandInitialState = useEdscStore.getInitialState()
      useEdscStore.setState({
        ...zustandInitialState,
        query: {
          collection: {
            keyword: 'basic search'
          },
          searchSource: 'landing'
        },
        shapefile: {
          file: null,
          isLoaded: false,
          isLoading: false,
          isErrored: false,
          shapefileName: '',
          selectedFeatures: []
        }
      })

      await store.dispatch(getCollections())

      const zustandState = useEdscStore.getState()

      // Verify shapefile store was NOT modified
      expect(zustandState.shapefile.file).toBeNull()
      expect(zustandState.shapefile.isLoaded).toBe(false)
      expect(zustandState.shapefile.selectedFeatures).toEqual([])

      // Verify searchSource was still reset
      expect(zustandState.query.searchSource).toBe('search')
    })
  })
})
