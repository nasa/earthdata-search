import focusedGranuleReducer from '../focusedGranule'
import { UPDATE_FOCUSED_GRANULE, RESTORE_FROM_URL } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = ''

    expect(focusedGranuleReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_FOCUSED_GRANULE', () => {
  test('returns the correct state', () => {
    const payload = 'granuleId'

    const action = {
      type: UPDATE_FOCUSED_GRANULE,
      payload
    }

    const expectedState = payload

    expect(focusedGranuleReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        focusedGranule: ''
      }
    }

    const expectedState = ''

    expect(focusedGranuleReducer(undefined, action)).toEqual(expectedState)
  })
})
