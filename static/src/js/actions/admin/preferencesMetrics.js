import PreferencesMetricsRequest from '../../util/request/admin/preferencesMetricsRequest'

import {
  SET_ADMIN_PREFERENCES_METRICS,
  SET_ADMIN_PREFERENCES_METRICS_LOADING,
  SET_ADMIN_PREFERENCES_METRICS_LOADED
} from '../../constants/actionTypes'

import actions from '../index'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

export const setAdminPreferencesMetrics = (preferencesMetrics) => ({
  type: SET_ADMIN_PREFERENCES_METRICS,
  payload: preferencesMetrics
})

export const setAdminPreferencesMetricsLoading = () => ({
  type: SET_ADMIN_PREFERENCES_METRICS_LOADING
})

export const setAdminPreferencesMetricsLoaded = () => ({
  type: SET_ADMIN_PREFERENCES_METRICS_LOADED
})

/**
 * Fetch the metrics from the database
 */
export const fetchAdminPreferencesMetrics = () => async (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

  const { authToken } = state

  dispatch(setAdminPreferencesMetricsLoading())

  const requestObject = new PreferencesMetricsRequest(authToken, earthdataEnvironment)

  const response = await requestObject.all()
    .then((responseObject) => {
      const { data } = responseObject
      const {
        results
      } = data

      dispatch(setAdminPreferencesMetricsLoaded())
      dispatch(setAdminPreferencesMetrics(results))
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'fetchAdminPreferencesMetrics',
        resource: 'admin preferences metrics',
        requestObject
      }))
    })

  return response
}
