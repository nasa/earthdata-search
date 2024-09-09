import {
  SET_ADMIN_METRICS_PREFERENCES,
  SET_ADMIN_METRICS_PREFERENCES_LOADING,
  SET_ADMIN_METRICS_PREFERENCES_LOADED
} from '../../constants/actionTypes'

const initialState = {
  preferences: {
    zoom: {},
    latitude: {},
    longitude: {},
    projection: {},
    overlayLayers: {},
    baseLayer: {},
    panelState: {},
    granuleSort: {},
    collectionSort: {},
    granuleListView: {},
    collectionListView: {}
  },
  isLoading: false,
  isLoaded: false
}

const adminMetricsPreferencesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ADMIN_METRICS_PREFERENCES_LOADED: {
      return {
        ...state,
        isLoaded: true,
        isLoading: false
      }
    }

    case SET_ADMIN_METRICS_PREFERENCES_LOADING: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true
      }
    }

    case SET_ADMIN_METRICS_PREFERENCES: {
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

export default adminMetricsPreferencesReducer
