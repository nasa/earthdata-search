import moxios from 'moxios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import {
  updateTimelineIntervals,
  updateTimelineQuery,
  updateTimelineState,
  getTimeline,
  changeTimelineState,
  changeTimelineQuery
} from '../timeline'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY,
  UPDATE_TIMELINE_STATE,
  UPDATE_AUTH
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

describe('updateTimelineIntervals', () => {
  test('should create an action to update the timeline granules', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_TIMELINE_INTERVALS,
      payload
    }
    expect(updateTimelineIntervals(payload)).toEqual(expectedAction)
  })
})

describe('updateTimelineQuery', () => {
  test('should create an action to update the timeline state', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_TIMELINE_QUERY,
      payload
    }
    expect(updateTimelineQuery(payload)).toEqual(expectedAction)
  })
})

describe('updateTimelineState', () => {
  test('should create an action to update the timeline query', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_TIMELINE_STATE,
      payload
    }
    expect(updateTimelineState(payload)).toEqual(expectedAction)
  })
})

describe('getTimeline', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls the API to get timeline granules', async () => {
    moxios.stubRequest(/gov\/search\/granules\/timeline.*/, {
      status: 200,
      response: [{
        'concept-id': 'collectionId',
        intervals: [
          [
            1298937600,
            1304208000,
            3
          ]
        ]
      }]
    })

    // mockStore with initialState
    const store = mockStore({
      auth: '',
      focusedCollection: {
        collectionId: 'collectionId'
      },
      query: {
        collection: {
          spatial: {}
        }
      },
      timeline: {
        query: {
          endDate: '2009-12-01T23:59:59.000Z',
          interval: 'day',
          startDate: '1979-01-01T00:00:00.000Z'
        }
      }
    })

    // call the dispatch
    await store.dispatch(getTimeline()).then(() => {
      // Is updateTimelineIntervals called with the right payload
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_AUTH,
        payload: ''
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_TIMELINE_INTERVALS,
        payload: {
          results: [{
            'concept-id': 'collectionId',
            intervals: [
              [
                1298937600,
                1304208000,
                3
              ]
            ]
          }]
        }
      })
    })
  })

  test('calls lambda to get authenticated timeline granules', async () => {
    moxios.stubRequest(/3001\/granules\/timeline.*/, {
      status: 200,
      response: [{
        'concept-id': 'collectionId',
        intervals: [
          [
            1298937600,
            1304208000,
            3
          ]
        ]
      }],
      headers: {
        'jwt-token': 'token'
      }
    })

    // mockStore with initialState
    const store = mockStore({
      auth: 'token',
      focusedCollection: {
        collectionId: 'collectionId'
      },
      query: {
        collection: {
          spatial: {}
        }
      },
      timeline: {
        query: {
          endDate: '2009-12-01T23:59:59.000Z',
          interval: 'day',
          startDate: '1979-01-01T00:00:00.000Z'
        }
      }
    })

    // call the dispatch
    await store.dispatch(getTimeline()).then(() => {
      // Is updateTimelineIntervals called with the right payload
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_TIMELINE_INTERVALS,
        payload: {
          results: [{
            'concept-id': 'collectionId',
            intervals: [
              [
                1298937600,
                1304208000,
                3
              ]
            ]
          }]
        }
      })
    })
  })

  test('returns no results if there is no focused collection', () => {
    const store = mockStore({
      focusedCollection: '',
      timeline: {
        query: {},
        state: {}
      }
    })

    store.dispatch(getTimeline())
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_TIMELINE_INTERVALS,
      payload: {
        results: []
      }
    })
  })

  test('does not call updateTimelineIntervals on error', async () => {
    moxios.stubRequest(/granules\/timeline.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      focusedCollection: {
        collectionId: 'collectionId'
      },
      query: {
        collection: {
          spatial: {}
        }
      },
      timeline: {
        query: {
          endDate: '2009-12-01T23:59:59.000Z',
          interval: 'day',
          startDate: '1979-01-01T00:00:00.000Z'
        }
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(getTimeline()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('changeTimelineState', () => {
  test('should create an action to update the timeline state', () => {
    const newState = {
      center: '123456789'
    }

    // mockStore with initialState
    const store = mockStore({
      timeline: {
        query: {},
        state: {}
      }
    })

    // call the dispatch
    store.dispatch(changeTimelineState({ newState }))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_TIMELINE_STATE,
      payload: {
        newState
      }
    })
  })
})

describe('changeTimelineQuery', () => {
  test('should create an action to update the timeline state', () => {
    const newQuery = {
      interval: 'day'
    }

    // mockStore with initialState
    const store = mockStore({
      timeline: {
        query: {},
        state: {}
      }
    })

    // mock getTimeline
    const getTimelineMock = jest.spyOn(actions, 'getTimeline')
    getTimelineMock.mockImplementation(() => jest.fn())

    // call the dispatch
    store.dispatch(changeTimelineQuery({ newQuery }))

    // Is updateCollectionQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_TIMELINE_QUERY,
      payload: {
        newQuery
      }
    })

    // was getTimeline called
    expect(getTimelineMock).toHaveBeenCalledTimes(1)
  })
})
