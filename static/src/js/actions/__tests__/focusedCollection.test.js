import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import { updateFocusedCollection, getFocusedCollection } from '../focusedCollection'
import { getCollectionsResponseUnauth, getCollectionsResponseAuth } from './mocks'
import {
  ADD_GRANULE_RESULTS_FROM_COLLECTIONS,
  COPY_GRANULE_RESULTS_TO_COLLECTION,
  RESET_GRANULE_RESULTS,
  UPDATE_AUTH,
  UPDATE_COLLECTION_METADATA,
  UPDATE_FOCUSED_COLLECTION,
  UPDATE_FOCUSED_GRANULE,
  UPDATE_GRANULE_QUERY,
  TOGGLE_SPATIAL_POLYGON_WARNING
} from '../../constants/actionTypes'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as cmrEnv from '../../../../../sharedUtils/cmrEnv'
import * as EventEmitter from '../../events/events'

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

    // mocks
    const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection')
    getFocusedCollectionMock.mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline')
    getTimelineMock.mockImplementation(() => jest.fn())

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
      },
      router: {
        location: {
          pathname: ''
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

    // were the mocks called
    expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
    expect(getTimelineMock).toHaveBeenCalledTimes(1)
  })

  test('without a collectionId it should clear the focusedCollection', () => {
    const collectionId = ''

    // mocks
    const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection')
    getFocusedCollectionMock.mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline')
    getTimelineMock.mockImplementation(() => jest.fn())
    const getFocusedGranuleMock = jest.spyOn(actions, 'getFocusedGranule')
    getFocusedGranuleMock.mockImplementation(() => jest.fn())
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

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
      focusedCollection: '',
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        },
        granules: {
          allIds: [],
          byId: {}
        }
      },
      query: {
        collection: {
          keyword: 'old stuff'
        }
      },
      router: {
        location: {
          pathname: ''
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
      type: UPDATE_FOCUSED_GRANULE,
      payload: ''
    })
    expect(storeActions[1]).toEqual({
      type: '@@router/CALL_HISTORY_METHOD',
      payload: {
        args: [{
          pathname: '/search',
          search: undefined
        }],
        method: 'push'
      }
    })

    // were the mocks called
    expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
    expect(getTimelineMock).toHaveBeenCalledTimes(1)
    expect(getFocusedGranuleMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
  })
})

describe('getFocusedCollection', () => {
  test('should update the focusedCollection and call getGranules', async () => {
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    nock(/cmr/)
      .post(/collections\.json/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?params_go_here',
          title: 'ECHO dataset metadata',
          entry: [{
            id: 'collectionId1',
            short_name: 'id_1',
            version_id: 'VersionID'
          }],
          facets: {},
          hits: 1
        }
      }, {
        'cmr-hits': 1
      })

    nock(/cmr/)
      .post(/collections\.umm_json/)
      .reply(200, {
        hits: 1,
        took: 234,
        items: [{
          meta: {
            'concept-id': 'collectionId1'
          },
          umm: {
            data: 'collectionId1'
          }
        }]
      }, {
        'cmr-hits': 1
      })

    const collectionId = 'collectionId'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())
    const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
    relevancyMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      authToken: '',
      focusedCollection: collectionId,
      metadata: {
        collections: {
          allIds: []
        }
      },
      query: {
        collection: {}
      },
      searchResults: {}
    })

    // call the dispatch
    await store.dispatch(getFocusedCollection()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_GRANULE_QUERY,
        payload: { pageNum: 1 }
      })
      expect(storeActions[2]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: [
          {
            collectionId: {
              isCwic: false,
              metadata: {}
            }
          }
        ]
      })
      expect(storeActions[3]).toEqual({
        type: UPDATE_AUTH,
        payload: ''
      })
      // updateCollectionMetadata
      expect(storeActions[4]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: getCollectionsResponseUnauth
      })
    })

    // was getGranules called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
    expect(relevancyMock).toHaveBeenCalledTimes(1)
  })

  test('should update the authenticated focusedCollection and call getGranules', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov',
      opensearchRoot: 'https://cmr.earthdata.nasa.gov/opensearch'
    }))
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    nock(/localhost/)
      .post(/collections\/json/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?params_go_here',
          title: 'ECHO dataset metadata',
          entry: [{
            id: 'collectionId1',
            short_name: 'id_1',
            version_id: 'VersionID'
          }],
          facets: {},
          hits: 1
        }
      }, {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    nock(/localhost/)
      .post(/collections\/umm_json/)
      .reply(200, {
        hits: 1,
        took: 234,
        items: [{
          meta: {
            'concept-id': 'collectionId1'
          },
          umm: {
            data: 'collectionId1'
          }
        }]
      }, {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    const collectionId = 'collectionId'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())
    const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
    relevancyMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      focusedCollection: collectionId,
      metadata: {
        collections: {
          allIds: []
        }
      },
      query: {
        collection: {}
      },
      searchResults: {
        granules: {}
      }
    })

    // call the dispatch
    await store.dispatch(actions.getFocusedCollection()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_GRANULE_QUERY,
        payload: { pageNum: 1 }
      })
      expect(storeActions[2]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: [
          {
            collectionId: {
              isCwic: false,
              metadata: {}
            }
          }
        ]
      })
      expect(storeActions[3]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      // updateCollectionMetadata
      expect(storeActions[4]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: getCollectionsResponseAuth
      })
    })

    // was getGranules called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
    expect(relevancyMock).toHaveBeenCalledTimes(1)
  })

  test('returns no result if there is no focusedCollection', () => {
    const store = mockStore({
      focusedCollection: '',
      searchResults: {
        granules: {}
      },
      metadata: {},
      query: {
        collection: {}
      }
    })

    store.dispatch(actions.getFocusedCollection())
    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: TOGGLE_SPATIAL_POLYGON_WARNING,
      payload: false
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: { pageNum: 1 }
    })
    expect(storeActions[2]).toEqual({
      type: UPDATE_COLLECTION_METADATA,
      payload: []
    })
  })

  test('does not call updateFocusedCollection on error', async () => {
    nock(/localhost/)
      .post(/collections/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: '',
      focusedCollection: 'collectionId',
      metadata: {
        collections: {
          allIds: []
        }
      },
      query: {
        collection: {}
      },
      searchResults: {
        granules: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
    relevancyMock.mockImplementation(() => jest.fn())

    await store.dispatch(actions.getFocusedCollection('')).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(relevancyMock).toHaveBeenCalledTimes(1)
    })
  })
})
