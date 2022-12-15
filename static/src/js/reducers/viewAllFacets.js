import {
  countSelectedFacets,
  getStartingLetters
} from '../util/facets'

import {
  LOADING_VIEW_ALL_FACETS,
  LOADED_VIEW_ALL_FACETS,
  UPDATE_VIEW_ALL_FACETS,
  TOGGLE_VIEW_ALL_FACETS_MODAL
} from '../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  hits: null,
  isLoaded: false,
  isLoading: false,
  selectedCategory: null
}

const viewAllFacetsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOADING_VIEW_ALL_FACETS: {
      return {
        ...state,
        selectedCategory: action.payload.selectedCategory
          ? action.payload.selectedCategory
          : state.selectedCategory,
        isLoading: true,
        isLoaded: false
      }
    }
    case LOADED_VIEW_ALL_FACETS: {
      return {
        ...state,
        isLoading: false,
        isLoaded: action.payload.loaded
      }
    }
    case UPDATE_VIEW_ALL_FACETS: {
      const byId = {}
      const allIds = []
      action.payload.facets.forEach((facetCategory) => {
        // Only add the category weve selected to the state
        if (facetCategory.title !== action.payload.selectedCategory) return
        byId[facetCategory.title] = facetCategory
        byId[facetCategory.title].totalSelected = countSelectedFacets(facetCategory)
        byId[facetCategory.title].startingLetters = getStartingLetters(facetCategory.children)
        allIds.push(facetCategory.title)
      })

      return {
        ...state,
        byId,
        allIds,
        hits: action.payload.hits
      }
    }
    case TOGGLE_VIEW_ALL_FACETS_MODAL: {
      // Clear out the results when the modal is closed
      if (action.payload !== false) return state
      return initialState
    }
    default:
      return state
  }
}

export default viewAllFacetsReducer
