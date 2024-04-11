import MetricsRetrievalsRequest from '../../util/request/admin/metricsRetrievalsRequest'

import {
  SET_ADMIN_METRICS_RETRIEVALS,
  SET_ADMIN_METRICS_RETRIEVALS_LOADING,
  SET_ADMIN_METRICS_RETRIEVALS_LOADED,
  UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE,
  UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE
} from '../../constants/actionTypes'

import actions from '../index'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const setAdminMetricRetrievals = (metricsRetrievals) => ({
  type: SET_ADMIN_METRICS_RETRIEVALS,
  payload: metricsRetrievals
})

export const setAdminMetricRetrievalsLoading = () => ({
  type: SET_ADMIN_METRICS_RETRIEVALS_LOADING
})

export const setAdminMetricRetrievalsLoaded = () => ({
  type: SET_ADMIN_METRICS_RETRIEVALS_LOADED
})

/**
 * Fetch the metrics from the database
 */
export const fetchAdminMetricsRetrievals = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { admin, authToken } = state

  const { metricsRetrievals } = admin
  const { startDate, endDate } = metricsRetrievals

  dispatch(setAdminMetricRetrievalsLoading())

  const requestObject = new MetricsRetrievalsRequest(authToken, earthdataEnvironment)

  const requestOpts = {
    start_date: startDate,
    end_date: endDate
  }

  const response = requestObject.all(requestOpts)
    .then((responseData) => {
      const { data } = responseData
      const {
        results
      } = data
      dispatch(setAdminMetricRetrievalsLoaded())
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
