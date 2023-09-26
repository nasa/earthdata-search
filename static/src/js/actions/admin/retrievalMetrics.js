import MetricsRetrievalsRequest from '../../util/request/admin/metricsRetrievalsRequest'
// import { addToast } from '../../util/addToast'

import {
  // SET_ADMIN_METRICS_RETRIEVAL,
  SET_ADMIN_METRICS_RETRIEVALS,
  SET_ADMIN_METRICS_RETRIEVALS_LOADING,
  SET_ADMIN_METRICS_RETRIEVALS_LOADED,
  // SET_ADMIN_METRICS_RETRIEVAL_LOADING,
  // SET_ADMIN_METRICS_RETRIEVAL_LOADED,
  // SET_ADMIN_METRICS_RETRIEVALS_PAGINATION,
  UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE,
  UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE
  // UPDATE_ADMIN_METRICS_RETRIEVALS_PAGE_NUM
} from '../../constants/actionTypes'

import actions from '../index'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
// import { displayNotificationType } from '../../constants/enums'

// export const setAdminMetricRetrieval = (payload) => ({
//   type: SET_ADMIN_METRICS_RETRIEVAL,
//   payload
// })

export const setAdminMetricRetrievals = (retrievals) => ({
  type: SET_ADMIN_METRICS_RETRIEVALS,
  payload: retrievals
})

export const setAdminMetricRetrievalsLoading = () => ({
  type: SET_ADMIN_METRICS_RETRIEVALS_LOADING
})

export const setAdminMetricRetrievalsLoaded = () => ({
  type: SET_ADMIN_METRICS_RETRIEVALS_LOADED
})

// export const setAdminMetricRetrievalLoading = (id) => ({
//   type: SET_ADMIN_METRICS_RETRIEVAL_LOADING,
//   payload: id
// })

// export const setAdminMetricRetrievalLoaded = (id) => ({
//   type: SET_ADMIN_METRICS_RETRIEVAL_LOADED,
//   payload: id
// })

// export const setAdminMetricRetrievalsPagination = (data) => ({
//   type: SET_ADMIN_METRICS_RETRIEVALS_PAGINATION,
//   payload: data
// })

/**
 * Fetch a retrieval from the database
 */
// export const fetchAdminMetricsRetrieval = (id) => (dispatch, getState) => {
//   const state = getState()

//   // Retrieve data from Redux using selectors
//   const earthdataEnvironment = getEarthdataEnvironment(state)

//   const { authToken } = state

//   dispatch(setAdminMetricRetrievalLoading(id))

//   const requestObject = new MetricsRetrievalsRequest(authToken, earthdataEnvironment)
//   const response = requestObject.fetch(id)
//     .then((response) => {
//       const { data } = response

//       dispatch(setAdminMetricRetrievalLoaded(id))
//       dispatch(setAdminMetricRetrieval(data))
//     })
//     .catch((error) => {
//       dispatch(actions.handleError({
//         error,
//         action: 'fetchAdminMetricsRetrieval',
//         resource: 'admin metrics retrieval',
//         requestObject
//       }))
//     })

//   return response
// }

/**
 * Fetch the metrics from the database
 */
export const fetchAdminMetricsRetrievals = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { admin, authToken } = state

  const { metricsRetrievals } = admin
  console.log('🚀 ~ file: retrievalMetrics.js:99 ~ fetchAdminMetricsRetrievals ~ admin:', admin)
  const { startDate, endDate } = metricsRetrievals
  // console.log('🚀 ~ file: retrievalMetrics.js:100 ~ fetchAdminMetricsRetrievals ~ startDate:', startDate)
  // const {
  //   pageSize,
  //   pageNum
  // } = pagination

  dispatch(setAdminMetricRetrievalsLoading())

  const requestObject = new MetricsRetrievalsRequest(authToken, earthdataEnvironment)

  const requestOpts = {
    // page_size: pageSize,
    // page_num: pageNum,
    start_date: startDate,
    end_date: endDate
  }
  // todo handle optional param
  // if (sortKey) requestOpts.sort_key = sortKey

  const response = requestObject.all(requestOpts)
    .then((response) => {
      const { data } = response
      const {
        // pagination,
        results
      } = data
      // todo this is what is parsing the response from the lambda function
      console.log('🚀 ~ file: retrievalMetrics.js:125 ~ .then ~ data:', data)

      console.log('🚀 ~ file: retrievalMetrics.js:125 ~ .then ~ results:', results)

      dispatch(setAdminMetricRetrievalsLoaded())
      // dispatch(setAdminMetricRetrievalsPagination(pagination))
      dispatch(setAdminMetricRetrievals(results))
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'fetchAdminMetricsRetrievals',
        resource: 'admin metrics retrievals',
        requestObject
      }))
    })

  return response
}

// export const adminViewMetricsRetrieval = (retrievalId) => (dispatch) => {
//   dispatch(actions.changeUrl({
//     pathname: `/admin/retrievalsMetrics/${retrievalId}`
//   }))
// }

export const updateAdminMetricsRetrievalsStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE,
    payload: startDate
  })
}

export const updateAdminMetricsRetrievalsEndDate = (endDate) => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE,
    payload: endDate
  })
}

//   dispatch(actions.fetchAdminMetricsRetrieval())
// }

// export const updateAdminMetricsRetrievalsPageNum = (pageNum) => (dispatch) => {
//   dispatch({
//     type: UPDATE_ADMIN_METRICS_RETRIEVALS_PAGE_NUM,
//     payload: pageNum
//   })

//   dispatch(actions.fetchAdminMetricsRetrieval())
// }

/**
//  * Sends a request to have the provided order requeued for processing
//  * @param {integer} orderId
//  */
// todo this can likely be removed
// export const requeueMetricsOrder = (orderId) => (dispatch, getState) => {
//   const state = getState()

//   // Retrieve data from Redux using selectors
//   const earthdataEnvironment = getEarthdataEnvironment(state)

//   const { authToken } = state

//   const requestObject = new MetricsRetrievalsRequest(authToken, earthdataEnvironment)
//   const response = requestObject.requeueOrder({ orderId })
//     .then(() => {
//       addToast('Order Requeued for processing', {
//         appearance: 'success',
//         autoDismiss: true
//       })
//     })
//     .catch((error) => {
//       dispatch(actions.handleError({
//         error,
//         action: 'requeueOrder',
//         resource: 'admin retrievals',
//         requestObject,
//         notificationType: displayNotificationType.toast
//       }))
//     })

//   return response
// }
