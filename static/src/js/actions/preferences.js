import { isEmpty } from 'lodash'
import jwt from 'jsonwebtoken'

import { SET_PREFERENCES, SET_PREFERENCES_IS_SUBMITTING } from '../constants/actionTypes'

import { addToast } from '../util/addToast'
import { displayNotificationType } from '../constants/enums'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { updateAuthTokenFromHeaders } from './authToken'

import PreferencesRequest from '../util/request/preferencesRequest'

import actions from './index'
import { changeMap } from './map'

export const setIsSubmitting = (payload) => ({
  type: SET_PREFERENCES_IS_SUBMITTING,
  payload
})

export const setPreferences = (payload) => ({
  type: SET_PREFERENCES,
  payload
})

export const setPreferencesFromJwt = (jwtToken) => (dispatch) => {
  if (!jwtToken) return

  const decoded = jwt.decode(jwtToken)
  const { preferences = {} } = decoded

  dispatch(setPreferences(preferences))

  // If the user has map preferences set use those to set the map store
  // This will happen on page load to ensure that the map will default to the
  // correct values
  const { mapView = {} } = preferences
  if (!isEmpty(mapView)) {
    const {
      baseLayer,
      latitude,
      longitude,
      overlayLayers,
      projection,
      zoom
    } = mapView

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

export const updatePreferences = (data) => (dispatch, getState) => {
  const { formData: preferences } = data

  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  dispatch(setIsSubmitting(true))

  const requestObject = new PreferencesRequest(authToken, earthdataEnvironment)

  const response = requestObject.update({ preferences })
    .then((response) => {
      const { data, headers } = response
      const { preferences } = data

      dispatch(updateAuthTokenFromHeaders(headers))
      dispatch(setPreferences(preferences))
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
