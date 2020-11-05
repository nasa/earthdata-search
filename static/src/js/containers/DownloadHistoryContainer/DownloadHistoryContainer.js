import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { parse } from 'qs'

import actions from '../../actions'
import { DownloadHistory } from '../../components/DownloadHistory/DownloadHistory'

const mapStateToProps = state => ({
  earthdataEnvironment: state.earthdataEnvironment,
  location: state.router.location,
  retrievalHistory: state.retrievalHistory.history,
  retrievalHistoryLoading: state.retrievalHistory.isLoading,
  retrievalHistoryLoaded: state.retrievalHistory.isLoaded
})

const mapDispatchToProps = dispatch => ({
  onFetchRetrievalHistory: (earthdataEnvironment) => {
    dispatch(actions.fetchRetrievalHistory(earthdataEnvironment))
  },
  onDeleteRetrieval: retrievalId => dispatch(actions.deleteRetrieval(retrievalId))
})

export class DownloadHistoryContainer extends Component {
  componentDidMount() {
    const {
      location,
      onFetchRetrievalHistory
    } = this.props

    const { search } = location
    const { ee: earthdataEnvironment } = parse(search, { ignoreQueryPrefix: true })

    onFetchRetrievalHistory(earthdataEnvironment)
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
  location: PropTypes.shape({}).isRequired,
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
