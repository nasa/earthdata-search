import { isEmpty, isEqual } from 'lodash-es'
import jwt from 'jsonwebtoken'

import { initialState } from '../reducers/map'

import { SET_PREFERENCES, SET_PREFERENCES_IS_SUBMITTING } from '../constants/actionTypes'

import { addToast } from '../util/addToast'
import { displayNotificationType } from '../constants/enums'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { updateAuthTokenFromHeaders } from './authToken'

import PreferencesRequest from '../util/request/preferencesRequest'

import actions from './index'
import { changeMap } from './map'
import mapLayers from '../constants/mapLayers'

export const setIsSubmitting = (payload) => ({
  type: SET_PREFERENCES_IS_SUBMITTING,
  payload
})

export const setPreferences = (payload) => ({
  type: SET_PREFERENCES,
  payload
})

export const setPreferencesFromJwt = (jwtToken) => (dispatch, getState) => {
  const { map: mapState = {} } = getState()

  if (!jwtToken) return

  const decoded = jwt.decode(jwtToken)
  const { preferences = {} } = decoded

  // TODO Remove in EDSC-4443
  // If there are map view preferences, ensure they are the new layer names
  if (preferences.mapView) {
    const { baseLayer, overlayLayers } = preferences.mapView
    if (baseLayer === 'blueMarble') {
      preferences.mapView.baseLayer = mapLayers.worldImagery
    }

    const referenceFeatureIndex = overlayLayers.indexOf('referenceFeatures')
    const referenceLabelsIndex = overlayLayers.indexOf('referenceLabels')
    overlayLayers[referenceFeatureIndex] = mapLayers.bordersRoads
    overlayLayers[referenceLabelsIndex] = mapLayers.placeLabels
  }

  dispatch(setPreferences(preferences))

  // If the user has map preferences use those to set the map store if there is no map url parameters
  // This will happen on page load to ensure that the map will default to the preferences
  const { mapView: preferencesMapView = {} } = preferences

  if (!isEmpty(preferencesMapView)) {
    if (isEqual(mapState, initialState)) {
      const {
        baseLayer,
        latitude,
        longitude,
        overlayLayers,
        projection,
        zoom
      } = preferencesMapView

      const base = {
        [baseLayer]: true
      }
      const overlays = {}
      overlayLayers.forEach((layer) => {
        overlays[layer] = true
      })

      dispatch(changeMap({
        base,
        latitude,
        longitude,
        overlays,
        projection,
        zoom
      }))
    }
  }
}

export const updatePreferences = (data) => (dispatch, getState) => {
  const { formData: preferences } = data

  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  dispatch(setIsSubmitting(true))

  const requestObject = new PreferencesRequest(authToken, earthdataEnvironment)

  const response = requestObject.update({ preferences })
    .then((responseObject) => {
      const {
        data: dataObject,
        headers
      } = responseObject
      const {
        preferences: newPreferences
      } = dataObject

      dispatch(updateAuthTokenFromHeaders(headers))
      dispatch(setPreferences(newPreferences))
      dispatch(setIsSubmitting(false))
      addToast('Preferences saved!', {
        appearance: 'success',
        autoDismiss: true
      })
    })
    .catch((error) => {
      dispatch(setIsSubmitting(false))
      dispatch(actions.handleError({
        error,
        action: 'updatePreferences',
        resource: 'preferences',
        requestObject,
        notificationType: displayNotificationType.toast
      }))
    })

  return response
}
