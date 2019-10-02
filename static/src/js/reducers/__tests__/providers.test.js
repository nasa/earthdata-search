import providersReducer from '../providers'
import { SET_PROVIDERS } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = []

    expect(providersReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_PROVIDERS', () => {
  test('returns the correct state', () => {
    const payload = [
      {
        provider: {
          id: 'abcd-1234-efgh-5678',
          organization_name: 'EDSC-TEST',
          provider_id: 'EDSC-TEST'
        }
      }, {
        provider: {
          id: 'abcd-1234-efgh-5678',
          organization_name: 'NON-EDSC-TEST',
          provider_id: 'NON-EDSC-TEST'
        }
      }
    ]

    const action = {
      type: SET_PROVIDERS,
      payload
    }

    expect(providersReducer(undefined, action)).toEqual(payload)
  })
})
