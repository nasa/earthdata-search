const initialCmrState = {}

const initialFeatureState = {}

export const cmrFacetsReducer = (state = initialCmrState, action) => {
  switch (action.type) {
    case 'ADD_SELECTED_CMR_FACET': {
      return {
        ...state,
        ...action.payload
      }
    }
    case 'REMOVE_SELECTED_CMR_FACET': {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export const featureFacetsReducer = (state = initialFeatureState, action) => {
  switch (action.type) {
    case 'ADD_SELECTED_FEATURE_FACET': {
      return {
        ...state,
        ...action.payload
      }
    }
    case 'REMOVE_SELECTED_FEATURE_FACET': {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}
