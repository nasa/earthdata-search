import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// import actions from '../index'
import {
  updateCollections,
  onCollectionsLoading,
  onCollectionsLoaded,
  onCollectionsErrored,
  updateFacets,
  onFacetsLoading,
  onFacetsLoaded,
  onFacetsErrored,
  getCollections
} from '../collections'
import {
  UPDATE_COLLECTIONS,
  LOADING_COLLECTIONS,
  LOADED_COLLECTIONS,
  ERRORED_COLLECTIONS,
  LOADING_FACETS,
  LOADED_FACETS,
  UPDATE_FACETS,
  ERRORED_FACETS,
  STARTED_TIMER,
  FINISHED_TIMER
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateCollections', () => {
  test('should create an action to update the search query', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_COLLECTIONS,
      payload
    }
    expect(updateCollections(payload)).toEqual(expectedAction)
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
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls the API to get collections', async () => {
    moxios.stubRequest(/collections.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
          title: 'ECHO dataset metadata',
          entry: [{
            mockCollectionData: 'goes here'
          }],
          facets: {},
          hits: 1
        }
      }
    })

    // mockStore with initialState
    const store = mockStore({
      query: {
        keyword: 'search keyword'
      }
    })

    // call the dispatch
    await store.dispatch(getCollections()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_COLLECTIONS })
      expect(storeActions[1]).toEqual({ type: LOADING_FACETS })
      expect(storeActions[2]).toEqual({ type: STARTED_TIMER })
      expect(storeActions[3]).toEqual({ type: FINISHED_TIMER })
      expect(storeActions[4]).toEqual({
        type: LOADED_COLLECTIONS,
        payload: { loaded: true }
      })
      expect(storeActions[5]).toEqual({
        type: LOADED_FACETS,
        payload: { loaded: true }
      })
      expect(storeActions[6]).toEqual({
        type: UPDATE_COLLECTIONS,
        payload: {
          keyword: 'search keyword',
          results: [{
            mockCollectionData: 'goes here'
          }],
          facets: [],
          hits: 1
        }
      })
    })
  })

  // test('returns no results if there is no focused collection', () => {
  //   const store = mockStore()

  //   store.dispatch(getGranules())
  //   const storeActions = store.getActions()
  //   expect(storeActions[0]).toEqual({
  //     type: UPDATE_GRANULES,
  //     payload: {
  //       results: []
  //     }
  //   })
  // })

  test('does not call updateCollections on error', async () => {
    moxios.stubRequest(/collections.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      query: {}
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(getCollections()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_COLLECTIONS })
      expect(storeActions[1]).toEqual({ type: LOADING_FACETS })
      expect(storeActions[2]).toEqual({ type: STARTED_TIMER })
      expect(storeActions[3]).toEqual({ type: FINISHED_TIMER })
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
