import {
  LOADING_FACETS,
  LOADED_FACETS,
  UPDATE_FACETS
} from '../constants/actionTypes'

const initialState = {
  byId: {},
  allIds: [],
  isLoading: false,
  isLoaded: false
}

const resultToStateObj = result => result

const facetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_FACETS: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      }
    }
    case LOADED_FACETS: {
      return {
        ...state,
        isLoading: false,
        isLoaded: action.payload.loaded
      }
    }
    case UPDATE_FACETS: {
      const byId = {}
      const allIds = []
      action.payload.facets.forEach((result) => {
        byId[result.title] = resultToStateObj(result)
        allIds.push(result.title)
      })

      return {
        ...state,
        byId,
        allIds
      }
    }
    default:
      return state
  }
}

export default facetsReducer
