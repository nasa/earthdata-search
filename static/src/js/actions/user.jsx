import jwt from 'jsonwebtoken'

import { SET_USER } from '../constants/actionTypes'

export const setUser = (payload) => ({
  type: SET_USER,
  payload
})

export const setUserFromJwt = (jwtToken) => (dispatch) => {
  if (!jwtToken) return

  const decoded = jwt.decode(jwtToken)
  const { username } = decoded

  dispatch(setUser({ username }))
}
