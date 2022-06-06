import { differenceWith, findIndex } from 'lodash'

import {
  LOADED_AUTOCOMPLETE,
  LOADING_AUTOCOMPLETE,
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SELECTED,
  DELETE_AUTOCOMPLETE_VALUE,
  RESTORE_FROM_URL,
  CLEAR_AUTOCOMPLETE_SELECTED,
  CLEAR_FILTERS
} from '../constants/actionTypes'

const initialState = {
  isLoaded: false,
  isLoading: false,
  params: null,
  suggestions: [],
  selected: []
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
    case CLEAR_AUTOCOMPLETE_SELECTED: {
      return {
        ...state,
        selected: []
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
    case UPDATE_AUTOCOMPLETE_SELECTED: {
      const { suggestion } = payload

      return {
        ...state,
        suggestions: [],
        selected: [
          ...state.selected,
          suggestion
        ]
      }
    }
    case DELETE_AUTOCOMPLETE_VALUE: {
      const {
        level,
        type: autocompleteType,
        value: autocompleteValue
      } = payload

      const { selected } = state
      const index = findIndex(selected, (item) => {
        const {
          fields,
          type: itemType,
          value: itemValue
        } = item
        // if the autocompleteType is science_keywords, check the correct level of keyword for the autocomplete
        if (autocompleteType === 'science_keywords' && level != null) {
          const parts = fields.split(':')
          return parts[level] === autocompleteValue
        }

        return itemType === autocompleteType && itemValue === autocompleteValue
      })

      return {
        ...state,
        selected: [
          ...selected.slice(0, index),
          ...selected.slice(index + 1)
        ]
      }
    }
    case RESTORE_FROM_URL: {
      const { autocompleteSelected = [] } = payload

      return {
        ...state,
        selected: autocompleteSelected
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
