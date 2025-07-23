import RetrievalRequest from '../../util/request/admin/retrievalRequest'

import { SET_ADMIN_IS_AUTHORIZED } from '../../constants/actionTypes'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

export const updateIsAuthorized = (isAuthorized) => ({
  type: SET_ADMIN_IS_AUTHORIZED,
  payload: isAuthorized
})

export const adminIsAuthorized = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

  const { authToken } = state

  const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)

  const response = requestObject.isAuthorized()
    .then(() => {
      // If the user is not authorized, the 401 will be caught before getting to this code.
      dispatch(updateIsAuthorized(true))
    })

  return response
}
