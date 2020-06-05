import autocompleteReducer from '../autocomplete'
import {
  CLEAR_AUTOCOMPLETE_SELECTED,
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  DELETE_AUTOCOMPLETE_VALUE,
  LOADED_AUTOCOMPLETE,
  LOADING_AUTOCOMPLETE,
  RESTORE_FROM_URL,
  UPDATE_AUTOCOMPLETE_SELECTED,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  CLEAR_FILTERS
} from '../../constants/actionTypes'

const initialState = {
  isLoaded: false,
  isLoading: false,
  params: null,
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
        type: 'mock_type',
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

describe('UPDATE_AUTOCOMPLETE_SELECTED', () => {
  test('returns the correct state', () => {
    const payload = {
      suggestion: {
        type: 'mock_type',
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
        type: 'mock_type',
        value: 'mock value'
      }]
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('DELETE_AUTOCOMPLETE_VALUE', () => {
  test('returns the correct state', () => {
    const payload = {
      type: 'mock_type_2',
      value: 'mock value 2'
    }
    const action = {
      type: DELETE_AUTOCOMPLETE_VALUE,
      payload
    }

    const expectedState = {
      ...initialState,
      selected: [{
        type: 'mock_type_1',
        value: 'mock value 1'
      }]
    }

    expect(autocompleteReducer({
      ...initialState,
      selected: [
        {
          type: 'mock_type_1',
          value: 'mock value 1'
        },
        {
          type: 'mock_type_2',
          value: 'mock value 2'
        }
      ]
    }, action)).toEqual(expectedState)
  })

  test('returns the correct state for science_keywords', () => {
    const payload = {
      level: 1,
      type: 'science_keywords',
      value: 'Clouds'
    }
    const action = {
      type: DELETE_AUTOCOMPLETE_VALUE,
      payload
    }

    const initial = {
      ...initialState,
      selected: [
        {
          type: 'science_keywords',
          fields: 'Atmosphere:Clouds:Cloud Properties:Cloud Frequency:Cloud Frequency',
          value: 'Cloud Frequency'
        },
        {
          type: 'science_keywords',
          fields: 'Atmosphere:Aerosols:Aerosol Backscatter:Stratospheric Aerosols',
          value: 'Stratospheric Aerosols'
        }
      ]
    }

    const expectedState = {
      ...initialState,
      selected: [{
        type: 'science_keywords',
        fields: 'Atmosphere:Aerosols:Aerosol Backscatter:Stratospheric Aerosols',
        value: 'Stratospheric Aerosols'
      }]
    }

    expect(autocompleteReducer(initial, action)).toEqual(expectedState)
  })

  test('returns the correct state for full science_keywords', () => {
    const payload = {
      type: 'science_keywords',
      value: 'Atmosphere:Clouds:Cloud Properties:Cloud Frequency:Cloud Frequency'
    }
    const action = {
      type: DELETE_AUTOCOMPLETE_VALUE,
      payload
    }

    const initial = {
      ...initialState,
      selected: [
        {
          type: 'science_keywords',
          value: 'Atmosphere:Clouds:Cloud Properties:Cloud Frequency:Cloud Frequency'
        },
        {
          type: 'science_keywords',
          value: 'Atmosphere:Aerosols:Aerosol Backscatter:Stratospheric Aerosols'
        }
      ]
    }

    const expectedState = {
      ...initialState,
      selected: [{
        type: 'science_keywords',
        value: 'Atmosphere:Aerosols:Aerosol Backscatter:Stratospheric Aerosols'
      }]
    }

    expect(autocompleteReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const payload = {
      autocompleteSelected: [{
        type: 'mock_type',
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
        type: 'mock_type',
        value: 'mock value'
      }]
    }

    expect(autocompleteReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('CLEAR_FILTERS', () => {
  test('returns the correct state', () => {
    const action = { type: CLEAR_FILTERS }

    expect(autocompleteReducer(undefined, action)).toEqual(initialState)
  })
})
