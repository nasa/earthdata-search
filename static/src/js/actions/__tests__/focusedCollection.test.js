import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import { updateFocusedCollection } from '../focusedCollection'
import {
  UPDATE_FOCUSED_COLLECTION,
  UPDATE_GRANULES,
  UPDATE_GRANULE_QUERY,
  UPDATE_AUTH
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateFocusedCollection', () => {
  test('should create an action to update the focused collection', () => {
    const payload = {
      collectionId: 'newCollectionId',
      metadata: {
        id: 'newCollectionId',
        metadata: 'here'
      }
    }
    const expectedAction = {
      type: UPDATE_FOCUSED_COLLECTION,
      payload
    }
    expect(updateFocusedCollection(payload)).toEqual(expectedAction)
  })
})

describe('changeFocusedCollection', () => {
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

    const newCollectionId = 'newCollectionId'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({ auth: '' })

    // call the dispatch
    await store.dispatch(actions.changeFocusedCollection(newCollectionId))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    const payload = {
      collectionId: 'newCollectionId',
      metadata: {
        mockCollectionData: 'goes here'
      }
    }
    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: { pageNum: 1 }
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_AUTH,
      payload: ''
    })
    expect(storeActions[2]).toEqual({
      type: UPDATE_FOCUSED_COLLECTION,
      payload
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

    const newCollectionId = 'newCollectionId'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({ auth: 'token' })

    // call the dispatch
    await store.dispatch(actions.changeFocusedCollection(newCollectionId))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    const payload = {
      collectionId: 'newCollectionId',
      metadata: {
        mockCollectionData: 'goes here'
      }
    }
    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: { pageNum: 1 }
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_AUTH,
      payload: 'token'
    })
    expect(storeActions[2]).toEqual({
      type: UPDATE_FOCUSED_COLLECTION,
      payload
    })

    // was getGranules called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
  })

  test('returns no result if there is no collectionId', () => {
    const store = mockStore()

    store.dispatch(actions.changeFocusedCollection())
    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: { pageNum: 1 }
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_FOCUSED_COLLECTION,
      payload: false
    })
    expect(storeActions[2]).toEqual({
      type: UPDATE_GRANULES,
      payload: {
        results: []
      }
    })
  })

  test('does not call updateFocusedCollection on error', async () => {
    moxios.stubRequest(/collections.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({ auth: '', focusedCollection: { collectionId: 'collectionId' } })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(actions.changeFocusedCollection('collectionId')).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
