import { push } from 'connected-react-router'
import prepareOrderParams from '../util/orders'
import RetrievalRequest from '../util/request/retrievalRequest'

import { isLinkType } from '../util/isLinkType'

import { UPDATE_RETRIEVAL } from '../constants/actionTypes'

export const updateRetrieval = retrievalData => ({
  type: UPDATE_RETRIEVAL,
  payload: retrievalData
})

export const submitRetrieval = () => (dispatch, getState) => {
  const orderParams = prepareOrderParams(getState())
  const { authToken } = orderParams

  const requestObject = new RetrievalRequest(authToken)

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
 * Fetch order data for an order
 */
export const fetchRetrieval = (id, authToken) => (dispatch) => {
  const requestObject = new RetrievalRequest(authToken)

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
        esi: []
      }
      order.links = []
      data.collections.forEach((collection) => {
        const {
          access_method: accessMethod,
          collection_metadata: collectionMetadata
        } = collection

        const { type } = accessMethod
        const accessMethodTypeKey = type.toLowerCase().replace(/ /g, '_')

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
      dispatch(updateRetrieval(order))
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

export default submitRetrieval
