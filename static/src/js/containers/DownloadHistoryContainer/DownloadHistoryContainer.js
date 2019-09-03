import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { DownloadHistory } from '../../components/DownloadHistory/DownloadHistory'

const mapStateToProps = state => ({
  retrievalHistory: state.retrievalHistory
})

const mapDispatchToProps = dispatch => ({
  onFetchRetrievalHistory: () => dispatch(actions.fetchRetrievalHistory())
})

export class DownloadHistoryContainer extends Component {
  componentDidMount() {
    const {
      onFetchRetrievalHistory
    } = this.props

    onFetchRetrievalHistory()
  }

  render() {
    const { retrievalHistory } = this.props

    return (
      <DownloadHistory retrievalHistory={retrievalHistory} />
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
  onFetchRetrievalHistory: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DownloadHistoryContainer)
)
