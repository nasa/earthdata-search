import { differenceWith } from 'lodash-es'

import {
  LOADED_AUTOCOMPLETE,
  LOADING_AUTOCOMPLETE,
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  CLEAR_FILTERS
} from '../constants/actionTypes'

const initialState = {
  isLoaded: false,
  isLoading: false,
  params: null,
  suggestions: []
}

const autocompleteReducer = (state = initialState, action = {}) => {
  const { payload, type } = action

  switch (type) {
    case LOADED_AUTOCOMPLETE: {
      const { loaded } = payload

      return {
        ...state,
        isLoaded: loaded,
        isLoading: false
      }
    }

    case LOADING_AUTOCOMPLETE: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true
      }
    }

    case CLEAR_AUTOCOMPLETE_SUGGESTIONS: {
      return {
        ...state,
        isLoaded: false
      }
    }

    case UPDATE_AUTOCOMPLETE_SUGGESTIONS: {
      const { params, suggestions } = payload

      // Removes any selected values from the list of selections
      const { selected } = state
      const nonSelectedSuggestions = differenceWith(
        suggestions,
        selected,
        (a, b) => a.type === b.type && a.value === b.value
      )

      return {
        ...state,
        params,
        suggestions: nonSelectedSuggestions
      }
    }

    case CLEAR_FILTERS: {
      return initialState
    }

    default:
      return state
  }
}

export default autocompleteReducer
