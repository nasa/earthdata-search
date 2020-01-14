import RetrievalRequest from '../../util/request/admin/retrievalRequest'

import {
  SET_ADMIN_RETRIEVAL,
  SET_ADMIN_RETRIEVALS,
  SET_ADMIN_RETRIEVAL_LOADED,
  SET_ADMIN_RETRIEVAL_LOADING,
  SET_ADMIN_RETRIEVALS_LOADED,
  SET_ADMIN_RETRIEVALS_LOADING,
  SET_ADMIN_RETRIEVALS_PAGINATION,
  UPDATE_ADMIN_RETRIEVALS_SORT_KEY,
  UPDATE_ADMIN_RETRIEVALS_PAGE_NUM
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

export const setAdminRetrievalsPagination = data => ({
  type: SET_ADMIN_RETRIEVALS_PAGINATION,
  payload: data
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
  const { admin, authToken } = getState()
  const { retrievals } = admin
  const { pagination } = retrievals
  const {
    pageSize,
    pageNum,
    sortKey
  } = pagination

  dispatch(setAdminRetrievalsLoading())

  const requestObject = new RetrievalRequest(authToken)
  const response = requestObject.all({
    page_size: pageSize,
    page_num: pageNum,
    sort_key: sortKey
  })
    .then((response) => {
      const { data } = response
      const { pagination, results } = data

      dispatch(setAdminRetrievalsPagination(pagination))
      dispatch(setAdminRetrievals(results))
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

export const updateAdminRetrievalsSortKey = sortKey => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_RETRIEVALS_SORT_KEY,
    payload: sortKey
  })

  dispatch(fetchAdminRetrievals())
}

export const updateAdminRetrievalsPageNum = pageNum => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_RETRIEVALS_PAGE_NUM,
    payload: pageNum
  })

  dispatch(fetchAdminRetrievals())
}
