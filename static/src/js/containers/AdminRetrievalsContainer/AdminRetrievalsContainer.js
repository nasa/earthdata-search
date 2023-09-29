import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrievals from '../../components/AdminRetrievals/AdminRetrievals'

export const mapStateToProps = (state) => ({
  retrievals: state.admin.retrievals,
  retrievalsLoading: state.admin.retrievals.isLoading,
  retrievalsLoaded: state.admin.retrievals.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onAdminViewRetrieval:
    (retrievalId) => dispatch(actions.adminViewRetrieval(retrievalId)),
  onFetchAdminRetrievals:
    () => dispatch(actions.fetchAdminRetrievals()),
  onUpdateAdminRetrievalsSortKey:
    (sortKey) => dispatch(
      actions.updateAdminRetrievalsSortKey(sortKey)
    ),
  onUpdateAdminRetrievalsPageNum:
    (pageNum) => dispatch(
      actions.updateAdminRetrievalsPageNum(pageNum)
    )
})

export class AdminRetrievalsContainer extends Component {
  componentDidMount() {
    const {
      onFetchAdminRetrievals
    } = this.props

    onFetchAdminRetrievals()
  }

  render() {
    const {
      history,
      onAdminViewRetrieval,
      onFetchAdminRetrievals,
      onUpdateAdminRetrievalsSortKey,
      onUpdateAdminRetrievalsPageNum,
      retrievals
    } = this.props

    const {
      push: historyPush
    } = history

    return (
      <AdminRetrievals
        historyPush={historyPush}
        onAdminViewRetrieval={onAdminViewRetrieval}
        onFetchAdminRetrievals={onFetchAdminRetrievals}
        onUpdateAdminRetrievalsSortKey={onUpdateAdminRetrievalsSortKey}
        onUpdateAdminRetrievalsPageNum={onUpdateAdminRetrievalsPageNum}
        retrievals={retrievals}
      />
    )
  }
}

AdminRetrievalsContainer.defaultProps = {
  retrievals: {}
}

AdminRetrievalsContainer.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  onAdminViewRetrieval: PropTypes.func.isRequired,
  onFetchAdminRetrievals: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsPageNum: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalsContainer)
)
