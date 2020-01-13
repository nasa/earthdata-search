import RetrievalRequest from '../../util/request/admin/retrievalRequest'
import { SET_ADMIN_IS_AUTHORIZED } from '../../constants/actionTypes'

export const updateIsAuthorized = isAuthorized => ({
  type: SET_ADMIN_IS_AUTHORIZED,
  payload: isAuthorized
})

export const adminIsAuthorized = () => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new RetrievalRequest(authToken)
  const response = requestObject.isAuthorized()
    .then(() => {
      // If the user is not authorized, the 401 will be caught before getting to this code.
      dispatch(updateIsAuthorized(true))
    })

  return response
}
