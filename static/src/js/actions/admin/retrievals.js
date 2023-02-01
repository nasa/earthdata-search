import RetrievalRequest from '../../util/request/admin/retrievalRequest'
import { addToast } from '../../util/addToast'

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

import actions from '../index'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { displayNotificationType } from '../../constants/enums'

export const setAdminRetrieval = (payload) => ({
  type: SET_ADMIN_RETRIEVAL,
  payload
})

export const setAdminRetrievals = (retrievals) => ({
  type: SET_ADMIN_RETRIEVALS,
  payload: retrievals
})

export const setAdminRetrievalsLoading = () => ({
  type: SET_ADMIN_RETRIEVALS_LOADING
})

export const setAdminRetrievalsLoaded = () => ({
  type: SET_ADMIN_RETRIEVALS_LOADED
})

export const setAdminRetrievalLoading = (id) => ({
  type: SET_ADMIN_RETRIEVAL_LOADING,
  payload: id
})

export const setAdminRetrievalLoaded = (id) => ({
  type: SET_ADMIN_RETRIEVAL_LOADED,
  payload: id
})

export const setAdminRetrievalsPagination = (data) => ({
  type: SET_ADMIN_RETRIEVALS_PAGINATION,
  payload: data
})

/**
 * Fetch a retrieval from the database
 */
export const fetchAdminRetrieval = (id) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  dispatch(setAdminRetrievalLoading(id))

  const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)
  const response = requestObject.fetch(id)
    .then((response) => {
      const { data } = response

      dispatch(setAdminRetrievalLoaded(id))
      dispatch(setAdminRetrieval(data))
    })
    .catch((error) => {
      dispatch(actions.handleError({
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
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { admin, authToken } = state

  const { retrievals } = admin
  const { sortKey, pagination } = retrievals
  const {
    pageSize,
    pageNum
  } = pagination

  dispatch(setAdminRetrievalsLoading())

  const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)

  const requestOpts = {
    page_size: pageSize,
    page_num: pageNum
  }

  if (sortKey) requestOpts.sort_key = sortKey

  const response = requestObject.all(requestOpts)
    .then((response) => {
      const { data } = response
      const { pagination, results } = data

      dispatch(setAdminRetrievalsLoaded())
      dispatch(setAdminRetrievalsPagination(pagination))
      dispatch(setAdminRetrievals(results))
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'fetchAdminRetrievals',
        resource: 'admin retrievals',
        requestObject
      }))
    })

  return response
}

export const adminViewRetrieval = (retrievalId) => (dispatch) => {
  dispatch(actions.changeUrl({
    pathname: `/admin/retrievals/${retrievalId}`
  }))
}

export const updateAdminRetrievalsSortKey = (sortKey) => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_RETRIEVALS_SORT_KEY,
    payload: sortKey
  })

  dispatch(actions.fetchAdminRetrievals())
}

export const updateAdminRetrievalsPageNum = (pageNum) => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_RETRIEVALS_PAGE_NUM,
    payload: pageNum
  })

  dispatch(actions.fetchAdminRetrievals())
}

/**
 * Sends a request to have the provided order requeued for processing
 * @param {integer} orderId
 */
export const requeueOrder = (orderId) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)
  const response = requestObject.requeueOrder({ orderId })
    .then(() => {
      addToast('Order Requeued for processing', {
        appearance: 'success',
        autoDismiss: true
      })
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'requeueOrder',
        resource: 'admin retrievals',
        requestObject,
        notificationType: displayNotificationType.toast
      }))
    })

  return response
}
