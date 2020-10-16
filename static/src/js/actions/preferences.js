import jwt from 'jsonwebtoken'

import PreferencesRequest from '../util/request/preferencesRequest'
import { SET_PREFERENCES, SET_PREFERENCES_IS_SUBMITTING } from '../constants/actionTypes'
import { displayNotificationType } from '../constants/enums'
import addToast from '../util/addToast'
import { updateAuthTokenFromHeaders } from './authToken'
import { handleError } from './errors'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

export const setIsSubmitting = payload => ({
  type: SET_PREFERENCES_IS_SUBMITTING,
  payload
})

export const setPreferences = payload => ({
  type: SET_PREFERENCES,
  payload
})

export const setPreferencesFromJwt = jwtToken => (dispatch) => {
  if (!jwtToken) return

  const decoded = jwt.decode(jwtToken)
  const { preferences } = decoded

  dispatch(setPreferences(preferences))
}

export const updatePreferences = data => (dispatch, getState) => {
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
      dispatch(handleError({
        error,
        action: 'updatePreferences',
        resource: 'preferences',
        requestObject,
        notificationType: displayNotificationType.toast
      }))
    })

  return response
}
