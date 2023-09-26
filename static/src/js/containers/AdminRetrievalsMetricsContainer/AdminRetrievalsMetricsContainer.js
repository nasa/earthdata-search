import React, { Component } from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrievalsMetrics from '../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics'

export const mapStateToProps = (state) => ({
  retrievals: state.admin.metricsRetrievals,
  retrievalsLoading: state.admin.metricsRetrievals.isLoading,
  retrievalsLoaded: state.admin.metricsRetrievals.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  // onAdminViewMetricsRetrieval:
  //   (retrievalId) => dispatch(actions.adminViewMetricsRetrieval(retrievalId)),
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
  // onUpdateAdminMetricsRetrievalsPageNum:
  //   (pageNum) => dispatch(
  //     actions.updateAdminMetricsRetrievalsPageNum(pageNum)
  //   )
})

export class AdminRetrievalsMetricsContainer extends Component {
  componentDidMount() {
    const {
      onFetchAdminMetricsRetrievals
    } = this.props

    onFetchAdminMetricsRetrievals()
  }

  render() {
    const {
      // history,
      // onAdminViewMetricsRetrieval,
      onFetchAdminMetricsRetrievals,
      onUpdateAdminMetricsRetrievalsStartDate,
      onUpdateAdminMetricsRetrievalsEndDate,
      // onUpdateAdminMetricsRetrievalsSortKey,
      // onUpdateAdminMetricsRetrievalsPageNum,
      retrievals
    } = this.props

    // const {
    //   push: historyPush
    // } = history
    // // todo make the props names match
    return (
      <AdminRetrievalsMetrics
        // historyPush={historyPush}
        // onAdminViewRetrieval={onAdminViewMetricsRetrieval}
        onFetchAdminRetrievals={onFetchAdminMetricsRetrievals}
        onUpdateAdminMetricsRetrievalsStartDate={onUpdateAdminMetricsRetrievalsStartDate}
        onUpdateAdminMetricsRetrievalsEndDate={onUpdateAdminMetricsRetrievalsEndDate}
        // onUpdateAdminRetrievalsSortKey={onUpdateAdminMetricsRetrievalsSortKey}
        // onUpdateAdminRetrievalsPageNum={onUpdateAdminMetricsRetrievalsPageNum}
        retrievals={retrievals}
      />
    )
  }
}

// AdminRetrievalsMetricsContainer.defaultProps = {
//   retrievals: {}
// }

// AdminRetrievalsMetricsContainer.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func
//   }).isRequired,
//   onAdminViewMetricsRetrieval: PropTypes.func.isRequired,
//   onFetchAdminMetricsRetrievals: PropTypes.func.isRequired,
//   // onUpdateAdminMetricsRetrievalsSortKey: PropTypes.func.isRequired,
//   // onUpdateAdminMetricsRetrievalsPageNum: PropTypes.func.isRequired,
//   retrievals: PropTypes.shape({})
// }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalsMetricsContainer)
)
