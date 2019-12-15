import {
  UPDATE_ADVANCED_SEARCH,
  RESTORE_FROM_URL,
  TOGGLE_DRAWING_NEW_LAYER
} from '../constants/actionTypes'

const initialState = {}

const advancedSearchReducer = (state = initialState, action) => {
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
      return {
        ...state,
        regionSearch: {}
      }
    }
    case RESTORE_FROM_URL: {
      const { advancedSearch = initialState } = action.payload

      return advancedSearch
    }
    default:
      return state
  }
}

export default advancedSearchReducer
