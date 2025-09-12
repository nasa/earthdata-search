import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'
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
    )
})

export const AdminRetrievalsMetricsContainer = ({
  onFetchAdminRetrievalsMetrics,
  onUpdateAdminRetrievalsMetricsStartDate,
  onUpdateAdminRetrievalsMetricsEndDate,
  retrievalsMetrics
}) => (
  <AdminRetrievalsMetrics
    onFetchAdminRetrievalsMetrics={onFetchAdminRetrievalsMetrics}
    onUpdateAdminRetrievalsMetricsStartDate={onUpdateAdminRetrievalsMetricsStartDate}
    onUpdateAdminRetrievalsMetricsEndDate={onUpdateAdminRetrievalsMetricsEndDate}
    retrievalsMetrics={retrievalsMetrics}
  />
)

AdminRetrievalsMetricsContainer.defaultProps = {
  retrievalsMetrics: {}
}

AdminRetrievalsMetricsContainer.propTypes = {
  onFetchAdminRetrievalsMetrics: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsMetricsEndDate: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsMetricsStartDate: PropTypes.func.isRequired,
  retrievalsMetrics: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalsMetricsContainer)
