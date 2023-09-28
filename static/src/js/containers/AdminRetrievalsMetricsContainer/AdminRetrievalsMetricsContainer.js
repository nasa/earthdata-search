import React from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrievalsMetrics from '../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics'

// todo need to decide what to do with the currentStartDate stuff
export const mapStateToProps = (state) => ({
  retrievals: state.admin.metricsRetrievals,
  retrievalsLoading: state.admin.metricsRetrievals.isLoading,
  retrievalsLoaded: state.admin.metricsRetrievals.isLoaded,
  currentStartDate: state.admin.startDate
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
  retrievals
}) => (
  <AdminRetrievalsMetrics
    onFetchAdminMetricsRetrievals={onFetchAdminMetricsRetrievals}
    onUpdateAdminMetricsRetrievalsStartDate={onUpdateAdminMetricsRetrievalsStartDate}
    onUpdateAdminMetricsRetrievalsEndDate={onUpdateAdminMetricsRetrievalsEndDate}
    retrievals={retrievals}
  />
)

// AdminRetrievalsMetricsContainer.defaultProps = {
//   retrievals: {}
// }

// AdminRetrievalsMetricsContainer.propTypes = {
//   onAdminViewMetricsRetrieval: PropTypes.func.isRequired,
//   onFetchAdminMetricsRetrievals: PropTypes.func.isRequired,
//   onUpdateAdminMetricsRetrievalsEndDate: PropTypes.func.isRequired,
//   onUpdateAdminMetricsRetrievalsEndDate: PropTypes.func.isRequired,
//   retrievals: PropTypes.shape({})
// }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalsMetricsContainer)
)
