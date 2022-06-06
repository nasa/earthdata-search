import {
  UPDATE_ADVANCED_SEARCH,
  RESTORE_FROM_URL,
  TOGGLE_DRAWING_NEW_LAYER,
  CLEAR_FILTERS
} from '../constants/actionTypes'

const initialState = {
  regionSearch: {}
}

const advancedSearchReducer = (state = initialState, action = {}) => {
  const {
    payload,
    type
  } = action

  switch (type) {
    case UPDATE_ADVANCED_SEARCH: {
      return {
        ...payload
      }
    }
    case TOGGLE_DRAWING_NEW_LAYER: {
      return initialState
    }
    case RESTORE_FROM_URL: {
      const { advancedSearch = initialState } = action.payload

      return advancedSearch
    }
    case CLEAR_FILTERS: {
      return initialState
    }
    default:
      return state
  }
}

export default advancedSearchReducer
