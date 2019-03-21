import mapReducer from '../map'
import { UPDATE_MAP } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {}

    expect(mapReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_MAP', () => {
  test('returns the correct state', () => {
    const payload = {
      mapParam: '0!0!2!1!0!0,2'
    }
    const action = {
      type: UPDATE_MAP,
      payload
    }

    const expectedState = payload

    expect(mapReducer(undefined, action)).toEqual(expectedState)
  })
})
