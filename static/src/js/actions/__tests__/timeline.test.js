import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import {
  updateTimelineIntervals,
  updateTimelineQuery,
  getTimeline,
  changeTimelineQuery
} from '../timeline'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

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

describe('getTimeline', () => {
  test('calls the API to get timeline granules', async () => {
    nock(/cmr/)
      .post(/granules\/timeline/)
      .reply(200, [{
        'concept-id': 'collectionId',
        intervals: [
          [
            1298937600,
            1304208000,
            3
          ]
        ]
      }])

    // mockStore with initialState
    const store = mockStore({
      authToken: '',
      browser: {
        name: 'browser name'
      },
      focusedCollection: 'collectionId',
      metadata: {},
      query: {
        collection: {
          spatial: {}
        }
      },
      router: {
        location: {
          pathname: ''
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
    nock(/localhost/)
      .post(/granules\/timeline/)
      .reply(200, [{
        'concept-id': 'collectionId',
        intervals: [
          [
            1298937600,
            1304208000,
            3
          ]
        ]
      }], {
        'jwt-token': 'token'
      })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      browser: {
        name: 'browser name'
      },
      focusedCollection: 'collectionId',
      metadata: {},
      query: {
        collection: {
          spatial: {}
        }
      },
      router: {
        location: {
          pathname: ''
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
      browser: {
        name: 'browser name'
      },
      focusedCollection: '',
      metadata: {},
      router: {
        location: {
          pathname: ''
        }
      },
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
    nock(/cmr/)
      .post(/granules\/timeline/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: '',
      browser: {
        name: 'browser name'
      },
      focusedCollection: 'collectionId',
      metadata: {},
      query: {
        collection: {
          spatial: {}
        }
      },
      router: {
        location: {
          pathname: ''
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

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getTimeline()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
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
      browser: {
        name: 'browser name'
      },
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
