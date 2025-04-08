import { isEmpty } from 'lodash-es'
import { SET_PREFERENCES, SET_PREFERENCES_IS_SUBMITTING } from '../constants/actionTypes'
import projections from '../util/map/projections'
import mapLayers from '../constants/mapLayers'

const initialState = {
  preferences: {
    panelState: 'default',
    collectionListView: 'default',
    granuleListView: 'default',
    mapView: {
      zoom: 3,
      latitude: 0,
      baseLayer: mapLayers.worldImagery,
      longitude: 0,
      projection: projections.geographic,
      overlayLayers: [
        'referenceFeatures',
        'referenceLabels'
      ],
      rotation: 0
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
