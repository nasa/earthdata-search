import advancedSearchReducer from '../advancedSearch'
import { UPDATE_ADVANCED_SEARCH, TOGGLE_DRAWING_NEW_LAYER } from '../../constants/actionTypes'

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

describe('TOGGLE_DRAWING_NEW_LAYER', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_DRAWING_NEW_LAYER
    }

    const expectedState = {
      regionSearch: {}
    }

    expect(advancedSearchReducer({
      regionSearch: {
        selectedRegion: {
          test: 'test'
        }
      }
    }, action)).toEqual(expectedState)
  })
})
