import RetrievalRequest from '../../util/request/admin/retrievalRequest'

import {
  SET_ADMIN_RETRIEVALS,
  SET_ADMIN_RETRIEVALS_LOADED,
  SET_ADMIN_RETRIEVALS_LOADING
} from '../../constants/actionTypes'
import { handleError } from '../errors'
import actions from '../index'

export const setAdminRetrievals = retrievals => ({
  type: SET_ADMIN_RETRIEVALS,
  payload: retrievals
})

export const setAdminRetrievalsLoading = () => ({
  type: SET_ADMIN_RETRIEVALS_LOADING
})

export const setAdminRetrievalsLoaded = () => ({
  type: SET_ADMIN_RETRIEVALS_LOADED
})

/**
 * Fetch a retrieval from the database
 */
export const fetchAdminRetrievals = () => (dispatch, getState) => {
  const { authToken } = getState()

  dispatch(setAdminRetrievalsLoading())

  const requestObject = new RetrievalRequest(authToken)
  const response = requestObject.all()
    .then((response) => {
      const { data } = response

      dispatch(setAdminRetrievals(data))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchAdminRetrievals',
        resource: 'admin retrievals',
        requestObject
      }))
    })

  return response
}

export const adminViewRetrieval = retrievalId => (dispatch) => {
  dispatch(actions.changeUrl({
    pathname: `/admin/retrievals/${retrievalId}`
  }))
}
