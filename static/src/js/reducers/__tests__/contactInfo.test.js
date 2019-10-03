import contactInfoReducer from '../contactInfo'
import { UPDATE_CONTACT_INFO } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {}

    expect(contactInfoReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_CONTACT_INFO', () => {
  test('returns the correct state', () => {
    const preferences = {
      echoPreferences: { mock: 'echo' },
      ursProfile: { mock: 'urs' }
    }
    const action = {
      type: UPDATE_CONTACT_INFO,
      payload: preferences
    }

    const expectedState = preferences

    expect(contactInfoReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the correct state with existing data', () => {
    const echoPreferences = { mock: 'echo' }
    const initial = {
      echoPreferences: { mock: 'old echo' },
      ursProfile: { mock: 'urs' }
    }
    const action = {
      type: UPDATE_CONTACT_INFO,
      payload: { echoPreferences }
    }

    const expectedState = {
      ...initial,
      echoPreferences
    }

    expect(contactInfoReducer(initial, action)).toEqual(expectedState)
  })
})
