import RetrievalCollectionRequest from '../util/request/retrievalCollectionRequest'

import { UPDATE_RETRIEVAL_COLLECTION } from '../constants/actionTypes'

import actions from './index'

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
      const { access_method: accessMethod } = data
      const { type } = accessMethod

      if (['download', 'OPeNDAP'].includes(type)) {
        dispatch(actions.setGranuleDownloadParams(data))
      } else {
        dispatch(updateRetrievalCollection(id, {
          ...data,
          isLoaded: true
        }))
      }
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}
