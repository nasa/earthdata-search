import RetrievalRequest from '../util/request/retrievalRequest'

import { SET_RETRIEVAL_HISTORY } from '../constants/actionTypes'

export const setRetrievalHistory = retrievalHistoryData => ({
  type: SET_RETRIEVAL_HISTORY,
  payload: retrievalHistoryData
})

/**
 * Fetch a retrieval from the database
 */
export const fetchRetrievalHistory = () => (dispatch, getState) => {
  const { authToken } = getState()
  const requestObject = new RetrievalRequest(authToken)
  const response = requestObject.all()
    .then((response) => {
      const { data } = response

      dispatch(setRetrievalHistory(data))
    })
    .catch((e) => {
      console.log('Failed to fetch retrievals', e)
    })

  return response
}

export default fetchRetrievalHistory
