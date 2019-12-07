import { UPDATE_ADVANCED_SEARCH } from '../constants/actionTypes'

const initialState = {}

const advancedSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ADVANCED_SEARCH: {
      return {
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default advancedSearchReducer
