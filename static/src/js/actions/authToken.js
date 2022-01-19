import { set, remove } from 'tiny-cookie'

import { UPDATE_AUTH } from '../constants/actionTypes'

import LogoutRequest from '../util/request/logoutRequest'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'

export const updateAuthToken = (payload) => ({
  type: UPDATE_AUTH,
  payload
})

export const updateAuthTokenFromHeaders = (headers) => (dispatch) => {
  const { 'jwt-token': jwtToken = '' } = headers || {}

  // Prevent optional authorizers from logging users out because they don't return an auth token
  if (jwtToken) {
    // Update the authToken cookie when we get a new token
    set('authToken', jwtToken)
    dispatch(updateAuthToken(jwtToken))
  }
}

export const logout = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  const requestObject = new LogoutRequest(authToken, earthdataEnvironment)

  const response = requestObject.logout()
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      // Remove the auth cookie
      remove('authToken')

      // Redirect to root url
      window.location.assign(`${portalPathFromState(state)}/search?ee=${earthdataEnvironment}`)
    })

  return response
}
