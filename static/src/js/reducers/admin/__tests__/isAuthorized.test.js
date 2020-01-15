import { SET_ADMIN_IS_AUTHORIZED } from '../../../constants/actionTypes'
import adminIsAuthorizedReducer from '../isAuthorized'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const expectedState = false

    expect(adminIsAuthorizedReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SET_ADMIN_IS_AUTHORIZED', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_ADMIN_IS_AUTHORIZED,
      payload: true
    }

    const expectedState = true

    expect(adminIsAuthorizedReducer(undefined, action)).toEqual(expectedState)
  })
})
