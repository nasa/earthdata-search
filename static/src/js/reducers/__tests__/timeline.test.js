import timelineReducer from '../timeline'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY,
  UPDATE_TIMELINE_STATE
} from '../../constants/actionTypes'

const initialState = {
  collectionId: '',
  intervals: [],
  query: {},
  state: {}
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(timelineReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_TIMELINE_INTERVALS', () => {
  test('returns the correct state', () => {
    const intervals = [
      [
        1298937600,
        1304208000,
        3
      ]
    ]

    const action = {
      type: UPDATE_TIMELINE_INTERVALS,
      payload: {
        results: [{
          'concept-id': 'collectionId',
          intervals
        }]
      }
    }

    const expectedState = {
      ...initialState,
      collectionId: 'collectionId',
      intervals
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

describe('UPDATE_TIMELINE_STATE', () => {
  test('returns the correct state', () => {
    const center = '123456789'

    const action = {
      type: UPDATE_TIMELINE_STATE,
      payload: { center }
    }

    const expectedState = {
      ...initialState,
      state: { center }
    }

    expect(timelineReducer(undefined, action)).toEqual(expectedState)
  })
})
