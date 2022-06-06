import { isEmpty } from 'lodash'
import { SET_PREFERENCES, SET_PREFERENCES_IS_SUBMITTING } from '../constants/actionTypes'

const initialState = {
  preferences: {
    panelState: 'default',
    collectionListView: 'default',
    granuleListView: 'default',
    mapView: {
      zoom: 2,
      latitude: 0,
      baseLayer: 'blueMarble',
      longitude: 0,
      projection: 'epsg4326',
      overlayLayers: [
        'referenceFeatures',
        'referenceLabels'
      ]
    }
  },
  isSubmitting: false,
  isSubmitted: false
}

const preferencesReducer = (state = initialState, action = {}) => {
  const { payload, type } = action

  switch (type) {
    case SET_PREFERENCES: {
      if (isEmpty(payload)) {
        return {
          ...state,
          preferences: {
            ...initialState.preferences
          }
        }
      }

      return {
        ...state,
        preferences: {
          ...payload
        }
      }
    }
    case SET_PREFERENCES_IS_SUBMITTING: {
      return {
        ...state,
        isSubmitting: payload
      }
    }
    default:
      return state
  }
}

export default preferencesReducer
