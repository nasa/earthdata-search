import { push } from 'connected-react-router'
import prepareOrderParams from '../util/orders'
import RetrievalRequest from '../util/request/retrievalRequest'

import { UPDATE_RETRIEVAL } from '../constants/actionTypes'

export const updateRetrieval = retrievalData => ({
  type: UPDATE_RETRIEVAL,
  payload: retrievalData
})

/**
 * Submit data representing a Retrieval to be stored in the database
 */
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
      console.log(e)
    })

  return response
}

/**
 * Fetch a retrieval from the database
 * @param {Integer} id Database ID of the retrieval to lookup
 * @param {String} authToken The authenticated users' JWT token
 */
export const fetchRetrieval = id => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new RetrievalRequest(authToken)
  const response = requestObject.fetch(id)
    .then((response) => {
      const { data } = response
      const { collections } = data

      const updatedCollections = {
        ...collections
      }

      Object.keys(collections).forEach((orderType) => {
        Object.keys(collections[orderType]).forEach((collectionId) => {
          const currentCollection = collections[orderType][collectionId]

          const { access_method: accessMethod } = currentCollection
          const { type } = accessMethod

          updatedCollections[orderType][collectionId] = {
            ...currentCollection,
            // Downloadable orders do not need to be loaded, default them to true
            isLoaded: ['download', 'OPeNDAP'].includes(type)
          }
        })
      })

      dispatch(updateRetrieval({
        ...data,
        collections: updatedCollections
      }))
    })
    .catch((e) => {
      console.log(e)
    })

  return response
}
