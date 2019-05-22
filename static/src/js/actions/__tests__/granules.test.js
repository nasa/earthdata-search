import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  updateGranuleResults,
  getGranules,
  excludeGranule,
  undoExcludeGranule
} from '../granules'
import {
  UPDATE_GRANULE_RESULTS,
  LOADING_GRANULES,
  STARTED_GRANULES_TIMER,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  UPDATE_AUTH,
  EXCLUDE_GRANULE_ID,
  UNDO_EXCLUDE_GRANULE_ID
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

describe('updateGranuleResults', () => {
  test('should create an action to update the search query', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_GRANULE_RESULTS,
      payload
    }
    expect(updateGranuleResults(payload)).toEqual(expectedAction)
  })
})

describe('getGranules', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls the API to get granules', async () => {
    moxios.stubRequest(/gov\/search\/granules.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
          title: 'ECHO granule metadata',
          entry: [{
            mockGranuleData: 'goes here'
          }]
        }
      },
      headers: {
        'cmr-hits': 1
      }
    })

    // mockStore with initialState
    const store = mockStore({
      authToken: '',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              mock: 'data'
            }
          }
        }
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      }
    })

    // call the dispatch
    await store.dispatch(getGranules()).then(() => {
      // Is updateGranuleResults called with the right payload
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_GRANULES })
      expect(storeActions[1]).toEqual({ type: STARTED_GRANULES_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_GRANULES_TIMER })
      expect(storeActions[3]).toEqual({
        type: UPDATE_AUTH,
        payload: ''
      })
      expect(storeActions[4]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          loaded: true
        }
      })
      expect(storeActions[5]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          hits: 1,
          isCwic: false,
          results: [{
            mockGranuleData: 'goes here',
            formatted_temporal: [
              null,
              null
            ],
            is_cwic: false
          }]
        }
      })
    })
  })

  test('calls lambda to get authenticated granules', async () => {
    moxios.stubRequest(/3001\/granules.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
          title: 'ECHO granule metadata',
          entry: [{
            mockGranuleData: 'goes here'
          }]
        }
      },
      headers: {
        'cmr-hits': 1,
        'jwt-token': 'token'
      }
    })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              mock: 'data'
            }
          }
        }
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      }
    })

    // call the dispatch
    await store.dispatch(getGranules()).then(() => {
      // Is updateGranules called with the right payload
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_GRANULES })
      expect(storeActions[1]).toEqual({ type: STARTED_GRANULES_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_GRANULES_TIMER })
      expect(storeActions[3]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      expect(storeActions[4]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          loaded: true
        }
      })
      expect(storeActions[5]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          hits: 1,
          isCwic: false,
          results: [{
            mockGranuleData: 'goes here',
            formatted_temporal: [
              null,
              null
            ],
            is_cwic: false
          }]
        }
      })
    })
  })

  test('returns no results if there is no focused collection', () => {
    // mockStore with initialState
    const store = mockStore({
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      }
    })

    store.dispatch(getGranules())
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_RESULTS,
      payload: {
        results: []
      }
    })
  })

  test('does not call updateGranuleResults on error', async () => {
    moxios.stubRequest(/granules.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      authToken: '',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              mock: 'data'
            }
          }
        }
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(getGranules()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('excludeGranule', () => {
  test('should create an action to update the collection', () => {
    const payload = {
      collectionId: 'collectionId',
      granuleId: 'granuleId'
    }
    const expectedAction = {
      type: EXCLUDE_GRANULE_ID,
      payload
    }
    const store = mockStore()
    store.dispatch(excludeGranule(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)
  })
})

describe('undoExcludeGranule', () => {
  test('should create an action to update the collection', () => {
    const payload = 'collectionId'
    const expectedAction = {
      type: UNDO_EXCLUDE_GRANULE_ID,
      payload
    }
    const store = mockStore()
    store.dispatch(undoExcludeGranule(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)
  })
})
