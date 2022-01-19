import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { DownloadHistory } from '../../components/DownloadHistory/DownloadHistory'

export const mapStateToProps = (state) => ({
  earthdataEnvironment: state.earthdataEnvironment,
  retrievalHistory: state.retrievalHistory.history,
  retrievalHistoryLoading: state.retrievalHistory.isLoading,
  retrievalHistoryLoaded: state.retrievalHistory.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchRetrievalHistory: (earthdataEnvironment) => {
    dispatch(actions.fetchRetrievalHistory(earthdataEnvironment))
  },
  onDeleteRetrieval:
    (retrievalId) => dispatch(actions.deleteRetrieval(retrievalId))
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
      earthdataEnvironment,
      retrievalHistory,
      onDeleteRetrieval,
      retrievalHistoryLoading,
      retrievalHistoryLoaded
    } = this.props

    return (
      <DownloadHistory
        earthdataEnvironment={earthdataEnvironment}
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
  earthdataEnvironment: PropTypes.string.isRequired,
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
