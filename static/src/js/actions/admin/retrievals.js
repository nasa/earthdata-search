import addToast from '../../util/addToast'
import RetrievalRequest from '../../util/request/admin/retrievalRequest'

import { displayNotificationType } from '../../constants/enums'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
import { getEdlToken } from '../../zustand/selectors/user'

/**
 * Sends a request to have the provided order requeued for processing
 * @param {integer} orderId
 */
export const requeueOrder = (orderId) => () => {
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  const requestObject = new RetrievalRequest(edlToken, earthdataEnvironment)

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
