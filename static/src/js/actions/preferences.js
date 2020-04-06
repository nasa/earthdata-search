import jwt from 'jsonwebtoken'

import PreferencesRequest from '../util/request/preferencesRequest'
import { SET_PREFERENCES, SET_PREFERENCES_IS_SUBMITTING } from '../constants/actionTypes'
import { updateAuthTokenFromHeaders } from './authToken'

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
      const { data } = response
      const { jwtToken } = data

      dispatch(updateAuthTokenFromHeaders({ 'jwt-token': jwtToken }))
      dispatch(setPreferencesFromJwt(jwtToken))

      dispatch(setIsSubmitting(false))
    })

  return response
}
