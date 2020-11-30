import * as deployedEnvironment from '../../../../../sharedUtils/deployedEnvironment'

import earthdataEnvironmentReducer from '../earthdataEnvironment'

import { RESTORE_FROM_URL } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

    const action = { type: 'dummy_action' }
    const initialState = 'prod'

    expect(earthdataEnvironmentReducer(undefined, action)).toEqual(initialState)
  })
})

describe('RESTORE_FROM_URL', () => {
  describe('when a value is not provided in the URL', () => {
    test('returns the deployed environment', () => {
      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

      const action = {
        type: RESTORE_FROM_URL,
        payload: {}
      }

      const expectedState = 'prod'

      expect(earthdataEnvironmentReducer(undefined, action)).toEqual(expectedState)
    })
  })

  describe('when a value is provided in the URL', () => {
    test('returns the value from the url', () => {
      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

      const action = {
        type: RESTORE_FROM_URL,
        payload: {
          earthdataEnvironment: 'uat'
        }
      }

      const expectedState = 'uat'

      expect(earthdataEnvironmentReducer(undefined, action)).toEqual(expectedState)
    })
  })
})
