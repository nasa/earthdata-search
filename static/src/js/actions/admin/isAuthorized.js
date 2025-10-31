import RetrievalRequest from '../../util/request/admin/retrievalRequest'

import { SET_ADMIN_IS_AUTHORIZED } from '../../constants/actionTypes'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
import { getEdlToken } from '../../zustand/selectors/user'

export const updateIsAuthorized = (isAuthorized) => ({
  type: SET_ADMIN_IS_AUTHORIZED,
  payload: isAuthorized
})

export const adminIsAuthorized = () => (dispatch) => {
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  const requestObject = new RetrievalRequest(edlToken, earthdataEnvironment)

  const response = requestObject.isAuthorized()
    .then(() => {
      // If the user is not authorized, the 401 will be caught before getting to this code.
      dispatch(updateIsAuthorized(true))
    })

  return response
}
