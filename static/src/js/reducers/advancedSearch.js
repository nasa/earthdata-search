import { UPDATE_ADVANCED_SEARCH, RESTORE_FROM_URL } from '../constants/actionTypes'

const initialState = {}

const advancedSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ADVANCED_SEARCH: {
      return {
        ...action.payload
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
