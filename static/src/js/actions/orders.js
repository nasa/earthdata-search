import prepareOrderParams from '../util/orders'
import OrderRequest from '../util/request/orderRequest'

export const submitOrder = () => (dispatch, getState) => {
  const orderParams = prepareOrderParams(getState())
  const { authToken } = orderParams

  const requestObject = new OrderRequest(authToken)

  const response = requestObject.submit(orderParams)
    .then((response) => {
      // TODO what should go here?
      console.log('order response', response)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

export default submitOrder
