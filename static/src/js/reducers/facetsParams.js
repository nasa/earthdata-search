import { findIndex, isEqual } from 'lodash'

import {
  TOGGLE_VIEW_ALL_FACETS_MODAL,
  UPDATE_SELECTED_FEATURE_FACET,
  UPDATE_SELECTED_CMR_FACET,
  UPDATE_SELECTED_VIEW_ALL_FACET,
  COPY_CMR_FACETS_TO_VIEW_ALL,
  RESTORE_FROM_URL,
  CLEAR_FILTERS,
  ADD_CMR_FACET,
  REMOVE_CMR_FACET
} from '../constants/actionTypes'

const initialCmrState = {}

const initialFeatureState = {
  availableFromAwsCloud: false,
  customizable: false,
  mapImagery: false,
  nearRealTime: false
}

const initialViewAllState = {}

export const cmrFacetsReducer = (state = initialCmrState, action) => {
  const { payload, type } = action

  switch (type) {
    case UPDATE_SELECTED_CMR_FACET: {
      return {
        ...state,
        ...payload
      }
    }
    case RESTORE_FROM_URL: {
      const { cmrFacets } = payload

      return {
        ...state,
        ...cmrFacets
      }
    }
    case ADD_CMR_FACET: {
      const [key] = Object.keys(payload)

      const prevKeyState = state[key] || []

      return {
        ...state,
        [key]: [
          ...prevKeyState,
          payload[key]
        ]
      }
    }
    case REMOVE_CMR_FACET: {
      const [key] = Object.keys(payload)
      const value = payload[key]

      const index = findIndex(state[key], (item) => isEqual(item, value))

      return {
        ...state,
        [key]: [
          ...state[key].slice(0, index),
          ...state[key].slice(index + 1)
        ]
      }
    }
    case CLEAR_FILTERS: {
      return initialCmrState
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
    case CLEAR_FILTERS: {
      return initialFeatureState
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
