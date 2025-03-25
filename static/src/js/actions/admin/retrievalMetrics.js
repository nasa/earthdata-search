import RetrievalsMetricsRequest from '../../util/request/admin/retrievalsMetricsRequest'

import {
  SET_ADMIN_RETRIEVALS_METRICS,
  SET_ADMIN_RETRIEVALS_METRICS_LOADING,
  SET_ADMIN_RETRIEVALS_METRICS_LOADED,
  UPDATE_ADMIN_RETRIEVALS_METRICS_START_DATE,
  UPDATE_ADMIN_RETRIEVALS_METRICS_END_DATE
} from '../../constants/actionTypes'

import actions from '../index'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const setAdminRetrievalsMetrics = (retrievalsMetrics) => ({
  type: SET_ADMIN_RETRIEVALS_METRICS,
  payload: retrievalsMetrics
})

export const setAdminRetrievalsMetricsLoading = () => ({
  type: SET_ADMIN_RETRIEVALS_METRICS_LOADING
})

export const setAdminRetrievalsMetricsLoaded = () => ({
  type: SET_ADMIN_RETRIEVALS_METRICS_LOADED
})

/**
 * Fetch the metrics from the database
 */
export const fetchAdminRetrievalsMetrics = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { admin, authToken } = state

  const { retrievalsMetrics } = admin
  const { startDate, endDate } = retrievalsMetrics

  dispatch(setAdminRetrievalsMetricsLoading())

  const requestObject = new RetrievalsMetricsRequest(authToken, earthdataEnvironment)

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
      dispatch(setAdminRetrievalsMetricsLoaded())
      dispatch(setAdminRetrievalsMetrics(results))
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'fetchAdminRetrievalsMetrics',
        resource: 'admin retrievals metrics',
        requestObject
      }))
    })

  return response
}

export const updateAdminRetrievalsMetricsStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_RETRIEVALS_METRICS_START_DATE,
    payload: startDate
  })
}

export const updateAdminRetrievalsMetricsEndDate = (endDate) => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_RETRIEVALS_METRICS_END_DATE,
    payload: endDate
  })
}
