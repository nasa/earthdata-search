import advancedSearchReducer from '../advancedSearch'
import {
  CLEAR_FILTERS,
  RESTORE_FROM_URL,
  TOGGLE_DRAWING_NEW_LAYER,
  UPDATE_ADVANCED_SEARCH
} from '../../constants/actionTypes'

const initialState = {
  regionSearch: {}
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

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

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const obj = {
      testField: 'test field'
    }
    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        advancedSearch: obj
      }
    }

    const expectedState = obj

    expect(advancedSearchReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the initial state if no object exists', () => {
    const action = {
      type: RESTORE_FROM_URL,
      payload: {}
    }

    expect(advancedSearchReducer(undefined, action)).toEqual(initialState)
  })
})

describe('CLEAR_FILTERS', () => {
  test('returns the correct state', () => {
    const action = { type: CLEAR_FILTERS }

    expect(advancedSearchReducer(undefined, action)).toEqual(initialState)
  })
})
