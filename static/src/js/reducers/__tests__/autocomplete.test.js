import autocompleteReducer from '../autocomplete'
import {
  CLEAR_AUTOCOMPLETE_SELECTED,
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  DELETE_AUTOCOMPLETE_VALUE,
  LOADED_AUTOCOMPLETE,
  LOADING_AUTOCOMPLETE,
  RESTORE_FROM_URL,
  UPDATE_AUTOCOMPLETE_SELECTED,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS
} from '../../constants/actionTypes'

const initialState = {
  isLoaded: false,
  isLoading: false,
  suggestions: [],
  selected: []
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(autocompleteReducer(undefined, action)).toEqual(initialState)
  })
})

describe('LOADING_AUTOCOMPLETE', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADING_AUTOCOMPLETE
    }

    const expectedState = {
      ...initialState,
      isLoading: true,
      isLoaded: false
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADED_AUTOCOMPLETE', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_AUTOCOMPLETE,
      payload: {
        loaded: true
      }
    }

    const expectedState = {
      ...initialState,
      isLoading: false,
      isLoaded: true
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('CLEAR_AUTOCOMPLETE_SELECTED', () => {
  test('returns the correct state', () => {
    const action = {
      type: CLEAR_AUTOCOMPLETE_SELECTED
    }

    const expectedState = {
      ...initialState
    }

    expect(autocompleteReducer({
      ...initialState,
      selected: [{
        type: 'mock type',
        value: 'mock value'
      }]
    }, action)).toEqual(expectedState)
  })
})

describe('CLEAR_AUTOCOMPLETE_SUGGESTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: CLEAR_AUTOCOMPLETE_SUGGESTIONS
    }

    const expectedState = {
      ...initialState
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_AUTOCOMPLETE_SUGGESTIONS', () => {
  test('returns the correct state', () => {
    const payload = {
      suggestions: [{
        type: 'mock type',
        value: 'mock value'
      }]
    }
    const action = {
      type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
      payload
    }

    const expectedState = {
      ...initialState,
      suggestions: [{
        type: 'mock type',
        value: 'mock value'
      }]
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_AUTOCOMPLETE_SELECTED', () => {
  test('returns the correct state', () => {
    const payload = {
      suggestion: {
        type: 'mock type',
        value: 'mock value'
      }
    }
    const action = {
      type: UPDATE_AUTOCOMPLETE_SELECTED,
      payload
    }

    const expectedState = {
      ...initialState,
      selected: [{
        type: 'mock type',
        value: 'mock value'
      }]
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('DELETE_AUTOCOMPLETE_VALUE', () => {
  test('returns the correct state', () => {
    const payload = {
      type: 'mock type 2',
      value: 'mock value 2'
    }
    const action = {
      type: DELETE_AUTOCOMPLETE_VALUE,
      payload
    }

    const expectedState = {
      ...initialState,
      selected: [{
        type: 'mock type 1',
        value: 'mock value 1'
      }]
    }

    expect(autocompleteReducer({
      ...initialState,
      selected: [
        {
          type: 'mock type 1',
          value: 'mock value 1'
        },
        {
          type: 'mock type 2',
          value: 'mock value 2'
        }
      ]
    }, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const payload = {
      autocompleteSelected: [{
        type: 'mock type',
        value: 'mock value'
      }]
    }
    const action = {
      type: RESTORE_FROM_URL,
      payload
    }

    const expectedState = {
      ...initialState,
      selected: [{
        type: 'mock type',
        value: 'mock value'
      }]
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })
})
