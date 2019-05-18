import authReducer from '../auth'
import { UPDATE_AUTH } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = ''

    expect(authReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_AUTH', () => {
  test('returns the correct state', () => {
    const token = 'auth-token'
    const action = {
      type: UPDATE_AUTH,
      payload: token
    }

    const expectedState = token

    expect(authReducer(undefined, action)).toEqual(expectedState)
  })
})
