import autocompleteReducer from '../autocomplete'
import {
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  LOADED_AUTOCOMPLETE,
  LOADING_AUTOCOMPLETE,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  CLEAR_FILTERS
} from '../../constants/actionTypes'

const initialState = {
  isLoaded: false,
  isLoading: false,
  params: null,
  suggestions: []
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
        type: 'mock_type',
        value: 'mock value'
      }],
      params: { q: 'mock' }
    }
    const action = {
      type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
      payload
    }

    const expectedState = {
      ...initialState,
      params: { q: 'mock' },
      suggestions: [{
        type: 'mock_type',
        value: 'mock value'
      }]
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })

  test('removes already selected values from suggestions', () => {
    const payload = {
      suggestions: [{
        type: 'type',
        value: 'value1'
      }, {
        type: 'type',
        value: 'value2'
      }],
      params: { q: 'mock' }
    }
    const action = {
      type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
      payload
    }

    const initial = {
      ...initialState,
      selected: [{
        type: 'type',
        value: 'value1'
      }]
    }

    const expectedState = {
      ...initial,
      params: { q: 'mock' },
      suggestions: [{
        type: 'type',
        value: 'value2'
      }]
    }

    expect(autocompleteReducer(initial, action)).toEqual(expectedState)
  })
})

describe('CLEAR_FILTERS', () => {
  test('returns the correct state', () => {
    const action = { type: CLEAR_FILTERS }

    expect(autocompleteReducer(undefined, action)).toEqual(initialState)
  })
})
