import browserReducer from '../browser'
import {
  UPDATE_BROWSER_VERSION
} from '../../constants/actionTypes'

const initialState = {}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(browserReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_BROWSER_VERSION', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_BROWSER_VERSION,
      payload: {
        name: 'some browser name'
      }
    }

    const expectedState = {
      name: 'some browser name'
    }

    expect(browserReducer(undefined, action)).toEqual(expectedState)
  })
})
