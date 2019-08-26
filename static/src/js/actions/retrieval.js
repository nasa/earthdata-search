import { push } from 'connected-react-router'
import prepareRetrievalParams from '../util/retrievals'
import RetrievalRequest from '../util/request/retrievalRequest'

import { UPDATE_RETRIEVAL } from '../constants/actionTypes'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'

export const updateRetrieval = retrievalData => ({
  type: UPDATE_RETRIEVAL,
  payload: retrievalData
})

/**
 * Submit data representing a Retrieval to be stored in the database
 */
export const submitRetrieval = () => (dispatch, getState) => {
  const state = getState()
  const orderParams = prepareRetrievalParams(state)
  const { authToken } = orderParams

  const requestObject = new RetrievalRequest(authToken)

  const response = requestObject.submit(orderParams)
    .then((response) => {
      const { id: retrievalId } = response.data

      dispatch(push(`${portalPathFromState(state)}/downloads/${retrievalId}`))
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

      Object.keys(collections.byId).forEach((collectionId) => {
        const currentCollection = collections.byId[collectionId]

        const { access_method: accessMethod } = currentCollection
        const { type } = accessMethod

        updatedCollections.byId[collectionId] = {
          ...currentCollection,
          // Downloadable orders do not need to be loaded, default them to true
          isLoaded: ['download', 'OPeNDAP'].includes(type)
        }
      })

      dispatch(updateRetrieval({
        ...data,
        collections: updatedCollections
      }))
    })
    .catch((e) => {
      console.log('Failed to fetch retrieval', e)
    })

  return response
}
