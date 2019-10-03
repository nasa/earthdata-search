import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { DownloadHistory } from '../../components/DownloadHistory/DownloadHistory'

const mapStateToProps = state => ({
  retrievalHistory: state.retrievalHistory.history,
  retrievalHistoryLoading: state.retrievalHistory.isLoading,
  retrievalHistoryLoaded: state.retrievalHistory.isLoaded
})

const mapDispatchToProps = dispatch => ({
  onFetchRetrievalHistory: () => dispatch(actions.fetchRetrievalHistory()),
  onDeleteRetrieval: retrievalId => dispatch(actions.deleteRetrieval(retrievalId))
})

export class DownloadHistoryContainer extends Component {
  componentDidMount() {
    const {
      onFetchRetrievalHistory
    } = this.props

    onFetchRetrievalHistory()
  }

  render() {
    const {
      retrievalHistory,
      onDeleteRetrieval,
      retrievalHistoryLoading,
      retrievalHistoryLoaded
    } = this.props

    return (
      <DownloadHistory
        retrievalHistory={retrievalHistory}
        retrievalHistoryLoading={retrievalHistoryLoading}
        retrievalHistoryLoaded={retrievalHistoryLoaded}
        onDeleteRetrieval={onDeleteRetrieval}
      />
    )
  }
}

DownloadHistoryContainer.defaultProps = {
  retrievalHistory: []
}

DownloadHistoryContainer.propTypes = {
  retrievalHistory: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  retrievalHistoryLoading: PropTypes.bool.isRequired,
  retrievalHistoryLoaded: PropTypes.bool.isRequired,
  onFetchRetrievalHistory: PropTypes.func.isRequired,
  onDeleteRetrieval: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DownloadHistoryContainer)
)
