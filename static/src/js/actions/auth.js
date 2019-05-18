import { UPDATE_AUTH } from '../constants/actionTypes'

export const updateAuth = payload => ({
  type: UPDATE_AUTH,
  payload
})

export const updateAuthFromHeaders = headers => (dispatch) => {
  const { 'jwt-token': jwtToken = '' } = headers || {}

  dispatch(updateAuth(jwtToken))
}
