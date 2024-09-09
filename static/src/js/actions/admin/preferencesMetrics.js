import MetricsPereferencesRequest from '../../util/request/admin/metricsPreferencesRequest'

import {
  SET_ADMIN_METRICS_PREFERENCES,
  SET_ADMIN_METRICS_PREFERENCES_LOADING,
  SET_ADMIN_METRICS_PREFERENCES_LOADED
} from '../../constants/actionTypes'

import actions from '../index'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const setAdminMetricPreferences = (metricsPreferences) => ({
  type: SET_ADMIN_METRICS_PREFERENCES,
  payload: metricsPreferences
})

export const setAdminMetricPreferencesLoading = () => ({
  type: SET_ADMIN_METRICS_PREFERENCES_LOADING
})

export const setAdminMetricPreferencesLoaded = () => ({
  type: SET_ADMIN_METRICS_PREFERENCES_LOADED
})

/**
 * Fetch the metrics from the database
 */
export const fetchAdminMetricsPreferences = () => async (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  dispatch(setAdminMetricPreferencesLoading())

  const requestObject = new MetricsPereferencesRequest(authToken, earthdataEnvironment)

  const response = await requestObject.all()
    .then((responseObject) => {
      const { data } = responseObject
      const {
        results
      } = data
      dispatch(setAdminMetricPreferencesLoaded())
      dispatch(setAdminMetricPreferences(results))
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
