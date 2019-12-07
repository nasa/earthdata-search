import advancedSearchReducer from '../advancedSearch'
import { UPDATE_ADVANCED_SEARCH } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {}

    expect(advancedSearchReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_ADVANCED_SEARCH', () => {
  test('returns the correct state', () => {
    const obj = {
      testField: 'test field'
    }
    const action = {
      type: UPDATE_ADVANCED_SEARCH,
      payload: obj
    }

    const expectedState = obj

    expect(advancedSearchReducer(undefined, action)).toEqual(expectedState)
  })
})
