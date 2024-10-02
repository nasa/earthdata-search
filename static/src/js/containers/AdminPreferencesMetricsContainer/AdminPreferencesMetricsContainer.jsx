import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminPreferencesMetrics from '../../components/AdminPreferencesMetrics/AdminPreferencesMetrics'

export const mapStateToProps = (state) => ({
  preferencesMetrics: state.admin.preferencesMetrics,
  preferencesLoading: state.admin.preferencesMetrics.isLoading,
  preferencesLoaded: state.admin.preferencesMetrics.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchAdminPreferencesMetrics:
    () => dispatch(actions.fetchAdminPreferencesMetrics())
})

export const AdminPreferencesMetricsContainer = ({
  onFetchAdminPreferencesMetrics,
  preferencesMetrics
}) => {
  useEffect(async () => {
    await onFetchAdminPreferencesMetrics()
  }, [])

  return (
    <AdminPreferencesMetrics
      preferencesMetrics={preferencesMetrics}
    />
  )
}

AdminPreferencesMetricsContainer.defaultProps = {
  preferencesMetrics: {}
}

AdminPreferencesMetricsContainer.propTypes = {
  onFetchAdminPreferencesMetrics: PropTypes.func.isRequired,
  preferencesMetrics: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminPreferencesMetricsContainer)
)
