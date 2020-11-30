import userReducer from '../user'
import { SET_USER } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {}

    expect(userReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_USER', () => {
  test('returns the correct state', () => {
    const user = {
      username: 'testUser'
    }
    const action = {
      type: SET_USER,
      payload: user
    }

    const expectedState = user

    expect(userReducer(undefined, action)).toEqual(expectedState)
  })
})
