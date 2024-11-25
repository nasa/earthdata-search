import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { metricsTemporalFilter } from '../../middleware/metrics/actions'
import AdminRetrievalsMetrics from '../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics'

export const mapStateToProps = (state) => ({
  retrievalsMetrics: state.admin.retrievalsMetrics,
  retrievalsLoading: state.admin.retrievalsMetrics.isLoading,
  retrievalsLoaded: state.admin.retrievalsMetrics.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchAdminRetrievalsMetrics:
    () => dispatch(actions.fetchAdminRetrievalsMetrics()),
  onUpdateAdminRetrievalsMetricsStartDate:
    (startDate) => dispatch(
      actions.updateAdminRetrievalsMetricsStartDate(startDate)
    ),
  onUpdateAdminRetrievalsMetricsEndDate:
    (endDate) => dispatch(
      actions.updateAdminRetrievalsMetricsEndDate(endDate)
    ),
  onMetricsTemporalFilter: (data) => dispatch(metricsTemporalFilter(data))
})

export const AdminRetrievalsMetricsContainer = ({
  onFetchAdminRetrievalsMetrics,
  onUpdateAdminRetrievalsMetricsStartDate,
  onUpdateAdminRetrievalsMetricsEndDate,
  retrievalsMetrics,
  onMetricsTemporalFilter
}) => (
  <AdminRetrievalsMetrics
    onFetchAdminRetrievalsMetrics={onFetchAdminRetrievalsMetrics}
    onUpdateAdminRetrievalsMetricsStartDate={onUpdateAdminRetrievalsMetricsStartDate}
    onUpdateAdminRetrievalsMetricsEndDate={onUpdateAdminRetrievalsMetricsEndDate}
    retrievalsMetrics={retrievalsMetrics}
    onMetricsTemporalFilter={onMetricsTemporalFilter}
  />
)

AdminRetrievalsMetricsContainer.defaultProps = {
  retrievalsMetrics: {}
}

AdminRetrievalsMetricsContainer.propTypes = {
  onFetchAdminRetrievalsMetrics: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsMetricsEndDate: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsMetricsStartDate: PropTypes.func.isRequired,
  onMetricsTemporalFilter: PropTypes.func.isRequired,
  retrievalsMetrics: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalsMetricsContainer)
)
