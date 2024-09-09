import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminPreferencesMetrics from '../../components/AdminPreferencesMetrics/AdminPreferencesMetrics'

export const mapStateToProps = (state) => ({
  metricsPreferences: state.admin.metricsPreferences,
  PreferencesLoading: state.admin.metricsPreferences.isLoading,
  PreferencesLoaded: state.admin.metricsPreferences.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchAdminMetricsPreferences:
    () => dispatch(actions.fetchAdminMetricsPreferences())
})

export const AdminPreferencesMetricsContainer = ({
  onFetchAdminMetricsPreferences,
  metricsPreferences
}) => (
  <AdminPreferencesMetrics
    onFetchAdminMetricsPreferences={onFetchAdminMetricsPreferences}
    metricsPreferences={metricsPreferences}
  />
)

AdminPreferencesMetricsContainer.defaultProps = {
  metricsPreferences: {}
}

AdminPreferencesMetricsContainer.propTypes = {
  onFetchAdminMetricsPreferences: PropTypes.func.isRequired,
  metricsPreferences: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminPreferencesMetricsContainer)
)
