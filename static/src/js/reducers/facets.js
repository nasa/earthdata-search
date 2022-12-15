import { countSelectedFacets } from '../util/facets'

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

const facetsReducer = (state = initialState, action = {}) => {
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
      action.payload.facets.forEach((facetCategory) => {
        byId[facetCategory.title] = facetCategory
        byId[facetCategory.title].totalSelected = countSelectedFacets(facetCategory)
        allIds.push(facetCategory.title)
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
