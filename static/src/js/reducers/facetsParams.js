import {
  TOGGLE_VIEW_ALL_FACETS_MODAL,
  UPDATE_SELECTED_FEATURE_FACET,
  UPDATE_SELECTED_CMR_FACET,
  UPDATE_SELECTED_VIEW_ALL_FACET,
  COPY_CMR_FACETS_TO_VIEW_ALL,
  RESTORE_FROM_URL
} from '../constants/actionTypes'

const initialCmrState = {}

const initialFeatureState = {
  mapImagery: false,
  nearRealTime: false,
  customizable: false
}

const initialViewAllState = {}

export const cmrFacetsReducer = (state = initialCmrState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_CMR_FACET: {
      return {
        ...state,
        ...action.payload
      }
    }
    case RESTORE_FROM_URL: {
      const { cmrFacets } = action.payload

      return {
        ...state,
        ...cmrFacets
      }
    }
    default:
      return state
  }
}

export const featureFacetsReducer = (state = initialFeatureState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_FEATURE_FACET: {
      return {
        ...state,
        ...action.payload
      }
    }
    case RESTORE_FROM_URL: {
      const { featureFacets } = action.payload

      return {
        ...state,
        ...featureFacets
      }
    }
    default:
      return state
  }
}

export const viewAllFacetsReducer = (state = initialViewAllState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_VIEW_ALL_FACET: {
      return {
        ...state,
        ...action.payload
      }
    }
    case TOGGLE_VIEW_ALL_FACETS_MODAL: {
      // Clear out the results when the modal is closed
      if (action.payload !== false) return state
      return initialViewAllState
    }
    case COPY_CMR_FACETS_TO_VIEW_ALL: {
      return {
        ...action.payload
      }
    }
    default:
      return state
  }
}
