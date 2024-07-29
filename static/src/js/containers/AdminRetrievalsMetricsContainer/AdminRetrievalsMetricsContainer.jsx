import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrievalsMetrics from '../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics'

export const mapStateToProps = (state) => ({
  metricsRetrievals: state.admin.metricsRetrievals,
  retrievalsLoading: state.admin.metricsRetrievals.isLoading,
  retrievalsLoaded: state.admin.metricsRetrievals.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchAdminMetricsRetrievals:
    () => dispatch(actions.fetchAdminMetricsRetrievals()),
  onUpdateAdminMetricsRetrievalsStartDate:
    (startDate) => dispatch(
      actions.updateAdminMetricsRetrievalsStartDate(startDate)
    ),
  onUpdateAdminMetricsRetrievalsEndDate:
    (endDate) => dispatch(
      actions.updateAdminMetricsRetrievalsEndDate(endDate)
    )
})

export const AdminRetrievalsMetricsContainer = ({
  onFetchAdminMetricsRetrievals,
  onUpdateAdminMetricsRetrievalsStartDate,
  onUpdateAdminMetricsRetrievalsEndDate,
  metricsRetrievals
}) => (
  <AdminRetrievalsMetrics
    onFetchAdminMetricsRetrievals={onFetchAdminMetricsRetrievals}
    onUpdateAdminMetricsRetrievalsStartDate={onUpdateAdminMetricsRetrievalsStartDate}
    onUpdateAdminMetricsRetrievalsEndDate={onUpdateAdminMetricsRetrievalsEndDate}
    metricsRetrievals={metricsRetrievals}
  />
)

AdminRetrievalsMetricsContainer.defaultProps = {
  metricsRetrievals: {}
}

AdminRetrievalsMetricsContainer.propTypes = {
  onFetchAdminMetricsRetrievals: PropTypes.func.isRequired,
  onUpdateAdminMetricsRetrievalsEndDate: PropTypes.func.isRequired,
  onUpdateAdminMetricsRetrievalsStartDate: PropTypes.func.isRequired,
  metricsRetrievals: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalsMetricsContainer)
)
