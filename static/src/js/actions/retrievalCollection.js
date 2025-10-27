import RetrievalCollectionRequest from '../util/request/retrievalCollectionRequest'

import {
  UPDATE_RETRIEVAL_COLLECTION,
  SET_RETRIEVAL_COLLECTION_LOADING
} from '../constants/actionTypes'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'
import { getAuthToken } from '../zustand/selectors/user'

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
export const fetchRetrievalCollection = (id) => (dispatch) => {
  const zustandState = useEdscStore.getState()
  const authToken = getAuthToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  dispatch(setRetrievalCollectionLoading({ id }))

  const requestObject = new RetrievalCollectionRequest(authToken, earthdataEnvironment)

  const response = requestObject.fetch(id)
    .then((responseObject) => {
      const { data } = responseObject

      dispatch(updateRetrievalCollection(id, {
        ...data,
        isLoaded: true
      }))
    })
    .catch((error) => {
      useEdscStore.getState().errors.handleError({
        error,
        action: 'fetchRetrievalCollection',
        resource: 'collection',
        requestObject
      })
    })

  return response
}
