import earthdataEnvironmentReducer from '../earthdataEnvironment'

import { RESTORE_FROM_URL } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = 'prod'

    expect(earthdataEnvironmentReducer(undefined, action)).toEqual(initialState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        earthdataEnvironment: 'prod'
      }
    }

    const expectedState = 'prod'

    expect(earthdataEnvironmentReducer(undefined, action)).toEqual(expectedState)
  })
})
