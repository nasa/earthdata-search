import timelineReducer from '../timeline'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY,
  RESTORE_FROM_URL
} from '../../constants/actionTypes'

const initialState = {
  intervals: {},
  query: {}
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(timelineReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_TIMELINE_INTERVALS', () => {
  test('returns the correct state', () => {
    const results = [
      {
        'concept-id': 'collectionId',
        intervals: [
          [
            1298937600,
            1304208000,
            3
          ]
        ]
      }
    ]

    const action = {
      type: UPDATE_TIMELINE_INTERVALS,
      payload: {
        results
      }
    }

    const expectedState = {
      ...initialState,
      intervals: {
        collectionId: [
          [
            1298937600,
            1304208000,
            3
          ]
        ]
      }
    }

    expect(timelineReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_TIMELINE_QUERY', () => {
  test('returns the correct state', () => {
    const interval = 'day'

    const action = {
      type: UPDATE_TIMELINE_QUERY,
      payload: { interval }
    }

    const expectedState = {
      ...initialState,
      query: { interval }
    }

    expect(timelineReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const timeline = {
      intervals: {},
      query: {}
    }

    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        timeline: timeline.query
      }
    }

    const expectedState = timeline

    expect(timelineReducer(undefined, action)).toEqual(expectedState)
  })
})
