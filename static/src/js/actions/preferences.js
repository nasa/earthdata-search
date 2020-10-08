import jwt from 'jsonwebtoken'

import PreferencesRequest from '../util/request/preferencesRequest'
import { SET_PREFERENCES, SET_PREFERENCES_IS_SUBMITTING } from '../constants/actionTypes'
import { PREFERENCES_SAVED_NOTIFICATION } from '../constants/strings'
import { displayNotificationType } from '../constants/enums'
import { pushSuccessNotification } from './notifications'
import { updateAuthTokenFromHeaders } from './authToken'
import { handleError } from './errors'

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
  const { authToken } = getState()

  dispatch(setIsSubmitting(true))

  const requestObject = new PreferencesRequest(authToken)

  const response = requestObject.update({ preferences })
    .then((response) => {
      const { data, headers } = response
      const { preferences } = data

      dispatch(updateAuthTokenFromHeaders(headers))
      dispatch(setPreferences(preferences))
      dispatch(setIsSubmitting(false))
      dispatch(pushSuccessNotification(PREFERENCES_SAVED_NOTIFICATION))
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
