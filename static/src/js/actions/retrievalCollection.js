import RetrievalCollectionRequest from '../util/request/retrievalCollectionRequest'

import {
  UPDATE_RETRIEVAL_COLLECTION,
  SET_RETRIEVAL_COLLECTION_LOADING
} from '../constants/actionTypes'
import { handleError } from './errors'

export const setRetrievalCollectionLoading = () => ({
  type: SET_RETRIEVAL_COLLECTION_LOADING
})

export const updateRetrievalCollection = (id, retrievalCollectionData) => ({
  type: UPDATE_RETRIEVAL_COLLECTION,
  payload: retrievalCollectionData
})

/**
 * Fetch order data for an order
 */
export const fetchRetrievalCollection = id => (dispatch, getState) => {
  const { authToken } = getState()

  dispatch(setRetrievalCollectionLoading())

  const requestObject = new RetrievalCollectionRequest(authToken)

  const response = requestObject.fetch(id)
    .then((response) => {
      const { data } = response

      dispatch(updateRetrievalCollection(id, {
        ...data,
        isLoaded: true
      }))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchRetrievalCollection',
        resource: 'collection'
      }))
    })

  return response
}
