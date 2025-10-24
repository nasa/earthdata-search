import addToast from '../../util/addToast'
import RetrievalRequest from '../../util/request/admin/retrievalRequest'

import { displayNotificationType } from '../../constants/enums'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

/**
 * Sends a request to have the provided order requeued for processing
 * @param {integer} orderId
 */
export const requeueOrder = (orderId) => (dispatch, getState) => {
  const state = getState()

  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

  const { authToken } = state

  const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)

  const response = requestObject.requeueOrder({ orderId })
    .then(() => {
      addToast('Order Requeued for processing', {
        appearance: 'success',
        autoDismiss: true
      })
    })
    .catch((error) => {
      useEdscStore.getState().errors.handleError({
        error,
        action: 'requeueOrder',
        resource: 'admin retrievals',
        requestObject,
        notificationType: displayNotificationType.toast
      })
    })

  return response
}
