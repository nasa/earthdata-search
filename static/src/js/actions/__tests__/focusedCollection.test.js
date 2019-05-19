import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import { updateFocusedCollection } from '../focusedCollection'
import {
  UPDATE_FOCUSED_COLLECTION,
  UPDATE_GRANULE_RESULTS,
  UPDATE_GRANULE_QUERY,
  UPDATE_COLLECTION_METADATA,
  ADD_COLLECTION_GRANULES,
  ADD_GRANULE_RESULTS_FROM_COLLECTIONS,
  UPDATE_AUTH
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('updateFocusedCollection', () => {
  test('should create an action to update the focused collection', () => {
    const payload = 'newCollectionId'
    const expectedAction = {
      type: UPDATE_FOCUSED_COLLECTION,
      payload
    }
    expect(updateFocusedCollection(payload)).toEqual(expectedAction)
  })
})

describe('changeFocusedCollection', () => {
  test('with a collectionId it should update the focusedCollection and call getFocusedCollection', () => {
    const collectionId = 'collectionId'

    // mock getFocusedCollection
    const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection')
    getFocusedCollectionMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      focusedCollection: '',
      query: {
        collection: {
          keyword: 'old stuff'
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeFocusedCollection(collectionId))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_FOCUSED_COLLECTION,
      payload: collectionId
    })

    // was getCollections called
    expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
  })

  test('with a previously visited collectionId it should update the focusedCollection and copy granules', () => {
    const collectionId = 'collectionId'

    // mock getFocusedCollection
    const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection')
    getFocusedCollectionMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const granules = {
      allIds: ['granule1'],
      byId: {
        granule1: {
          mock: 'data'
        }
      }
    }
    const store = mockStore({
      metadata: {
        collections: {
          allIds: [collectionId],
          byId: {
            [collectionId]: {
              granules
            }
          }
        }
      },
      focusedCollection: '',
      query: {
        collection: {
          keyword: 'old stuff'
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeFocusedCollection(collectionId))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_GRANULE_RESULTS_FROM_COLLECTIONS,
      payload: {
        ...granules
      }
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_FOCUSED_COLLECTION,
      payload: collectionId
    })

    // was getCollections called
    expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
  })

  test('without a collectionId it should clear the focusedCollection', () => {
    const collectionId = ''

    // mock getFocusedCollection
    const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection')
    getFocusedCollectionMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const granules = {
      allIds: ['granule1'],
      byId: {
        granule1: {
          mock: 'data'
        }
      }
    }
    const store = mockStore({
      collections: {
        allIds: [],
        byId: {}
      },
      focusedCollection: '',
      query: {
        collection: {
          keyword: 'old stuff'
        }
      },
      searchResults: {
        granules
      }
    })

    // call the dispatch
    store.dispatch(actions.changeFocusedCollection(collectionId))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_COLLECTION_GRANULES,
      payload: {
        collectionId: '',
        granules
      }
    })

    // was getCollections called
    expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
  })
})

describe('getFocusedCollection', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('should update the focusedCollection and call getGranules', async () => {
    moxios.stubRequest(/gov\/search\/collections.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?params_go_here',
          title: 'ECHO dataset metadata',
          entry: [{
            mockCollectionData: 'goes here'
          }],
          facets: {},
          hits: 1
        }
      }
    })

    const collectionId = 'collectionId'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      auth: '',
      focusedCollection: collectionId,
      searchResults: {
        granules: {}
      }
    })

    // call the dispatch
    await store.dispatch(actions.getFocusedCollection()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_GRANULE_QUERY,
        payload: { pageNum: 1 }
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_AUTH,
        payload: ''
      })
      // updateCollectionMetadata
      expect(storeActions[2]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: {
          [collectionId]: {
            mockCollectionData: 'goes here'
          }
        }
      })
    })

    // was getGranules called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
  })

  test('should update the authenticated focusedCollection and call getGranules', async () => {
    moxios.stubRequest(/3001\/collections.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?params_go_here',
          title: 'ECHO dataset metadata',
          entry: [{
            mockCollectionData: 'goes here'
          }],
          facets: {},
          hits: 1
        }
      },
      headers: {
        'cmr-hits': 1,
        'jwt-token': 'token'
      }
    })

    const collectionId = 'collectionId'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      auth: 'token',
      focusedCollection: collectionId,
      searchResults: {
        granules: {}
      }
    })

    // call the dispatch
    await store.dispatch(actions.getFocusedCollection()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_GRANULE_QUERY,
        payload: { pageNum: 1 }
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      // updateCollectionMetadata
      expect(storeActions[2]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: {
          [collectionId]: {
            mockCollectionData: 'goes here'
          }
        }
      })
    })

    // was getGranules called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
  })

  test('should not call getGranules is previous granules are used', async () => {
    moxios.stubRequest(/collections.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?params_go_here',
          title: 'ECHO dataset metadata',
          entry: [{
            mockCollectionData: 'goes here'
          }],
          facets: {},
          hits: 1
        }
      }
    })

    const collectionId = 'collectionId'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const granules = {
      allIds: ['granule1'],
      byId: {
        granule1: {
          mock: 'data'
        }
      }
    }
    const store = mockStore({
      focusedCollection: collectionId,
      searchResults: {
        granules
      }
    })

    // call the dispatch
    await store.dispatch(actions.getFocusedCollection()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_GRANULE_QUERY,
        payload: { pageNum: 1 }
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_AUTH,
        payload: ''
      })
      // updateCollectionMetadata
      expect(storeActions[2]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: {
          [collectionId]: {
            mockCollectionData: 'goes here'
          }
        }
      })
    })

    // was getGranules called
    expect(getGranulesMock).toHaveBeenCalledTimes(0)
  })

  test('returns no result if there is no focusedCollection', () => {
    const store = mockStore({
      focusedCollection: '',
      searchResults: {
        granules: {}
      }
    })

    store.dispatch(actions.getFocusedCollection())
    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: { pageNum: 1 }
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_GRANULE_RESULTS,
      payload: { results: [] }
    })
  })

  test('does not call updateFocusedCollection on error', async () => {
    moxios.stubRequest(/collections.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      auth: '',
      focusedCollection: 'collectionId',
      searchResults: {
        granules: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(actions.getFocusedCollection('')).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
