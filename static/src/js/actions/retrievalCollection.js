import RetrievalCollectionRequest from '../util/request/retrievalCollectionRequest'

import {
  UPDATE_RETRIEVAL_COLLECTION,
  SET_RETRIEVAL_COLLECTION_LOADING
} from '../constants/actionTypes'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { handleError } from './errors'

export const setRetrievalCollectionLoading = (retrievalCollection) => ({
  type: SET_RETRIEVAL_COLLECTION_LOADING,
  payload: retrievalCollection
})

export const updateRetrievalCollection = (id, retrievalCollectionData) => ({
  type: UPDATE_RETRIEVAL_COLLECTION,
  payload: retrievalCollectionData
})

/**
 * Fetch order data for an order
 */
export const fetchRetrievalCollection = (id) => (dispatch, getState) => {
  const state = getState()

  const { authToken } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  dispatch(setRetrievalCollectionLoading({ id }))

  const requestObject = new RetrievalCollectionRequest(authToken, earthdataEnvironment)

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
        resource: 'collection',
        requestObject
      }))
    })

  return response
}
