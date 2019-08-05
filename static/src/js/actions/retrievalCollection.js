import RetrievalCollectionRequest from '../util/request/retrievalCollectionRequest'

import actions from './index'

/**
 * Fetch order data for an order
 */
export const fetchRetrievalCollection = (id, authToken) => (dispatch) => {
  const requestObject = new RetrievalCollectionRequest(authToken)

  const response = requestObject.fetch(id)
    .then((response) => {
      const { data } = response

      dispatch(actions.setGranuleDownloadParams(data))
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

export default fetchRetrievalCollection
