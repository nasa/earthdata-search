import {
  SET_ADMIN_PREFERENCES_METRICS,
  SET_ADMIN_PREFERENCES_METRICS_LOADING,
  SET_ADMIN_PREFERENCES_METRICS_LOADED
} from '../../constants/actionTypes'

const initialState = {
  preferences: {
    zoom: [],
    latitude: [],
    longitude: [],
    projection: [],
    overlayLayers: [],
    baseLayer: [],
    panelState: [],
    granuleSort: [],
    collectionSort: [],
    granuleListView: [],
    showTourPreference: [],
    collectionListView: []
  },
  isLoading: false,
  isLoaded: false
}

const adminPreferencesMetricsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ADMIN_PREFERENCES_METRICS_LOADED: {
      return {
        ...state,
        isLoaded: true,
        isLoading: false
      }
    }

    case SET_ADMIN_PREFERENCES_METRICS_LOADING: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true
      }
    }

    case SET_ADMIN_PREFERENCES_METRICS: {
      const { preferences } = action.payload

      return {
        ...state,
        preferences
      }
    }

    default:
      return state
  }
}

export default adminPreferencesMetricsReducer
