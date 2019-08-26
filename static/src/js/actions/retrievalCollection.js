import RetrievalCollectionRequest from '../util/request/retrievalCollectionRequest'

import { UPDATE_RETRIEVAL_COLLECTION } from '../constants/actionTypes'

export const updateRetrievalCollection = (id, retrievalCollectionData) => ({
  type: UPDATE_RETRIEVAL_COLLECTION,
  payload: retrievalCollectionData
})

/**
 * Fetch order data for an order
 */
export const fetchRetrievalCollection = id => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new RetrievalCollectionRequest(authToken)

  const response = requestObject.fetch(id)
    .then((response) => {
      const { data } = response

      dispatch(updateRetrievalCollection(id, {
        ...data,
        isLoaded: true
      }))
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}
