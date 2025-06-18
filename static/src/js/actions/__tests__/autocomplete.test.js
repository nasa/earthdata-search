import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  onAutocompleteLoading,
  onAutocompleteLoaded,
  clearAutocompleteSuggestions,
  updateAutocompleteSuggestions,
  mapAutocompleteToFacets,
  fetchAutocomplete,
  selectAutocompleteSuggestion,
  cancelAutocomplete
} from '../autocomplete'

import {
  LOADING_AUTOCOMPLETE,
  LOADED_AUTOCOMPLETE,
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS
} from '../../constants/actionTypes'

import actions from '..'
import useEdscStore from '../../zustand/useEdscStore'

const mockStore = configureMockStore([thunk])

describe('onAutocompleteLoading', () => {
  test('should create an action to update the store', () => {
    const expectedAction = {
      type: LOADING_AUTOCOMPLETE
    }
    expect(onAutocompleteLoading()).toEqual(expectedAction)
  })
})

describe('onAutocompleteLoaded', () => {
  test('should create an action to update the store', () => {
    const payload = { loaded: true }
    const expectedAction = {
      type: LOADED_AUTOCOMPLETE,
      payload
    }
    expect(onAutocompleteLoaded(payload)).toEqual(expectedAction)
  })
})

describe('clearAutocompleteSuggestions', () => {
  test('should create an action to update the store', () => {
    const expectedAction = {
      type: CLEAR_AUTOCOMPLETE_SUGGESTIONS
    }
    expect(clearAutocompleteSuggestions()).toEqual(expectedAction)
  })
})

describe('updateAutocompleteSuggestions', () => {
  test('should create an action to update the store', () => {
    const payload = [{
      type: 'mock_type',
      fields: 'mock value',
      value: 'mock value'
    }]
    const expectedAction = {
      type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
      payload
    }
    expect(updateAutocompleteSuggestions(payload)).toEqual(expectedAction)
  })
})

describe('cancelAutocomplete', () => {
  test('sets autocomplete as loaded when cancelled', () => {
    // MockStore with initialState
    const store = mockStore({
      authToken: ''
    })

    store.dispatch(cancelAutocomplete()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: LOADED_AUTOCOMPLETE,
        payload: { loaded: true }
      })
    })
  })
})

describe('fetchAutocomplete', () => {
  test('calls lambda to get autocomplete suggestions', async () => {
    nock(/localhost/)
      .post(/autocomplete/)
      .reply(200, {
        feed: {
          entry: [{
            type: 'mock_type',
            fields: 'mock value',
            value: 'mock value'
          }]
        }
      })

    // MockStore with initialState
    const store = mockStore({
      authToken: ''
    })

    // Call the dispatch
    await store.dispatch(fetchAutocomplete({ value: 'test value' })).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_AUTOCOMPLETE })
      expect(storeActions[1]).toEqual({
        type: LOADED_AUTOCOMPLETE,
        payload: { loaded: true }
      })

      expect(storeActions[2]).toEqual({
        type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
        payload: {
          params: {
            q: 'test value'
          },
          suggestions: [{
            type: 'mock_type',
            fields: 'mock value',
            value: 'mock value'
          }]
        }
      })
    })
  })

  test('does not call updateAutocompleteSuggestions on error', async () => {
    nock(/localhost/)
      .post(/autocomplete/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: ''
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    await store.dispatch(fetchAutocomplete({ value: 'test value' })).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_AUTOCOMPLETE })
      expect(storeActions[1]).toEqual({
        type: LOADED_AUTOCOMPLETE,
        payload: { loaded: false }
      })

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('mapAutocompleteToFacets', () => {
  test('maps science keywords autocomplete to facets', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Land Surface:Surface Radiative Properties:Reflectance:Laser Reflectance',
        type: 'science_keywords'
      }
    }

    const result = {
      science_keywords_h: {
        topic: 'Land Surface',
        term: 'Surface Radiative Properties',
        variable_level_1: 'Reflectance',
        variable_level_2: 'Laser Reflectance'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toEqual(result)
  })

  test('maps science keywords autocomplete to facets when a facet level doesn\'t exist', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Land Surface:Surface Radiative Properties::Laser Reflectance',
        type: 'science_keywords'
      }
    }

    const result = {
      science_keywords_h: {
        topic: 'Land Surface',
        term: 'Surface Radiative Properties',
        variable_level_2: 'Laser Reflectance'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toEqual(result)
  })

  test('maps platforms autocomplete to facets', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Space-based Platforms:Earth Observation Satellites:Landsat:LANDSAT-8',
        type: 'platforms'
      }
    }

    const result = {
      platforms_h: {
        basis: 'Space-based Platforms',
        category: 'Earth Observation Satellites',
        sub_category: 'Landsat',
        short_name: 'LANDSAT-8'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toEqual(result)
  })

  test('maps platforms autocomplete to facets when a facet level doesn\'t exist', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Space-based Platforms:Earth Observation Satellites::LANDSAT-8',
        type: 'platforms'
      }
    }

    const result = {
      platforms_h: {
        basis: 'Space-based Platforms',
        category: 'Earth Observation Satellites',
        short_name: 'LANDSAT-8'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toEqual(result)
  })

  test('returns null for autocomplete suggestions that don\'t need mapping', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Landsat',
        type: 'platform'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toBeNull()
  })
})

describe('selectAutocompleteSuggestion', () => {
  test('calls updateAutocompleteSelected and changeQuery', () => {
    nock(/localhost/)
      .post(/autocomplete_logger/)
      .reply(200)

    const changeQueryMock = jest.spyOn(actions, 'changeQuery')
    changeQueryMock.mockImplementation(() => jest.fn())

    useEdscStore.setState({
      home: {
        setOpenFacetGroup: jest.fn()
      },
      facetParams: {
        addCmrFacetFromAutocomplete: jest.fn()
      }
    })

    const store = mockStore({
      autocomplete: {
        params: { q: 'mock' }
      }
    })

    const data = {
      suggestion: {
        type: 'instrument',
        fields: 'mock value',
        value: 'mock value'
      }
    }

    store.dispatch(selectAutocompleteSuggestion(data))

    const zustandState = useEdscStore.getState()
    const { home, facetParams } = zustandState
    const { setOpenFacetGroup } = home
    const { addCmrFacetFromAutocomplete } = facetParams

    expect(setOpenFacetGroup).toHaveBeenCalledTimes(1)
    expect(setOpenFacetGroup).toHaveBeenCalledWith('instrument')

    expect(addCmrFacetFromAutocomplete).toHaveBeenCalledTimes(1)
    expect(addCmrFacetFromAutocomplete).toHaveBeenCalledWith({
      instrument_h: 'mock value'
    })

    // Was getCollections called
    expect(changeQueryMock).toHaveBeenCalledTimes(1)
    expect(changeQueryMock).toHaveBeenCalledWith({
      collection: {
        pageNum: 1,
        keyword: ''
      }
    })
  })
})
