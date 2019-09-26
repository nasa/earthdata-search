import authTokenReducer from '../authToken'
import { UPDATE_AUTH } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = ''

    expect(authTokenReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_AUTH', () => {
  test('returns the correct state', () => {
    const token = 'authToken-token'
    const action = {
      type: UPDATE_AUTH,
      payload: token
    }

    const expectedState = token

    expect(authTokenReducer(undefined, action)).toEqual(expectedState)
  })
})
