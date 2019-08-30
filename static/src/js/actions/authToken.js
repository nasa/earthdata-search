import { set } from 'tiny-cookie'

import { UPDATE_AUTH } from '../constants/actionTypes'

export const updateAuthToken = payload => ({
  type: UPDATE_AUTH,
  payload
})

export const updateAuthTokenFromHeaders = headers => (dispatch) => {
  const { 'jwt-token': jwtToken = '' } = headers || {}

  // Update the authToken cookie when we get a new token
  set('authToken', jwtToken)
  dispatch(updateAuthToken(jwtToken))
}
