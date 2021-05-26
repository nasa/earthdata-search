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

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

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

    // mockStore with initialState
    const store = mockStore({
      authToken: '',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        viewAllFacets: {}
      },
      query: {
        collection: {
          pageNum: 1,
          keyword: 'search keyword'
        }
      },
      cmr: {},
      facetsParams: {
        feature: {
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        }
      }
    })

    // call the dispatch
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

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        viewAllFacets: {}
      },
      query: {
        collection: {
          keyword: 'search keyword'
        }
      },
      cmr: {},
      facetsParams: {
        feature: {
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        }
      }
    })

    // call the dispatch
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
      },
      query: {
        collection: {}
      },
      cmr: {},
      facetsParams: {
        feature: {
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        }
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
})
