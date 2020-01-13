import RetrievalRequest from '../../util/request/admin/retrievalRequest'

import {
  SET_ADMIN_RETRIEVAL,
  SET_ADMIN_RETRIEVALS,
  SET_ADMIN_RETRIEVAL_LOADED,
  SET_ADMIN_RETRIEVAL_LOADING,
  SET_ADMIN_RETRIEVALS_LOADED,
  SET_ADMIN_RETRIEVALS_LOADING
} from '../../constants/actionTypes'
import { handleError } from '../errors'
import actions from '../index'

export const setAdminRetrieval = (id, payload) => ({
  type: SET_ADMIN_RETRIEVAL,
  payload
})

export const setAdminRetrievals = retrievals => ({
  type: SET_ADMIN_RETRIEVALS,
  payload: retrievals
})

export const setAdminRetrievalLoading = () => ({
  type: SET_ADMIN_RETRIEVAL_LOADING
})

export const setAdminRetrievalLoaded = () => ({
  type: SET_ADMIN_RETRIEVAL_LOADED
})

export const setAdminRetrievalsLoading = id => ({
  type: SET_ADMIN_RETRIEVALS_LOADING,
  payload: id
})

export const setAdminRetrievalsLoaded = id => ({
  type: SET_ADMIN_RETRIEVALS_LOADED,
  payload: id
})

/**
 * Fetch a retrieval from the database
 */
export const fetchAdminRetrieval = id => (dispatch, getState) => {
  const { authToken } = getState()

  dispatch(setAdminRetrievalLoading(id))

  const requestObject = new RetrievalRequest(authToken)
  const response = requestObject.fetch(id)
    .then((response) => {
      const { data } = response

      dispatch(setAdminRetrieval(id, data))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchAdminRetrieval',
        resource: 'admin retrieval',
        requestObject
      }))
    })

  return response
}

/**
 * Fetch a group of retrievals from the database
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

export const adminIsAuthorized = () => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new RetrievalRequest(authToken)
  const response = requestObject.isAuthorized()
  return response
}
