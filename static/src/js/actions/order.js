import { push } from 'connected-react-router'
import prepareOrderParams from '../util/orders'
import OrderRequest from '../util/request/orderRequest'

import { isLinkType } from '../util/isLinkType'

import { UPDATE_ORDER } from '../constants/actionTypes'

export const updateOrder = orderData => ({
  type: UPDATE_ORDER,
  payload: orderData
})

export const submitOrder = () => (dispatch, getState) => {
  const orderParams = prepareOrderParams(getState())
  const { authToken } = orderParams

  const requestObject = new OrderRequest(authToken)

  const response = requestObject.submit(orderParams)
    .then((response) => {
      const { id: retrievalId } = response.data
      dispatch(push(`/data/retrieve/${retrievalId}`))
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

/**
 * Convert the type of a provided UMM-S record to an object friendly key
 * @param {String} type A UMM-S record type
 */
const fromUmmServiceType = type => type.toLowerCase().replace(/ /g, '_')

/**
 * Fetch order data for an order
 */
export const fetchOrder = (id, authToken) => (dispatch) => {
  const requestObject = new OrderRequest(authToken)

  const response = requestObject.collections(id)
    .then((response) => {
      const { data } = response
      const order = {}
      order.id = data.id
      order.environment = data.environment
      order.jsondata = data.jsondata
      order.collections = {
        download: [],
        echo_orders: [],
        esi: [],
        opendap: []
      }
      order.links = []
      data.collections.forEach((collection) => {
        const {
          access_method: accessMethod,
          collection_metadata: collectionMetadata
        } = collection

        const { type } = accessMethod
        const accessMethodTypeKey = fromUmmServiceType(type)

        const {
          dataset_id: datasetId,
          links
        } = collectionMetadata

        order.collections[accessMethodTypeKey] = [
          ...order.collections[accessMethodTypeKey],
          collection
        ]

        const metdataLinks = links.filter((link = {}) => isLinkType(link.rel, 'metadata'))

        order.links.push({
          datasetId,
          links: metdataLinks
        })
      })
      dispatch(updateOrder(order))
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

export default submitOrder
