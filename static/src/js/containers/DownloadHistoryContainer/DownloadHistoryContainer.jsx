import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { DownloadHistory } from '../../components/DownloadHistory/DownloadHistory'
import RetrievalRequest from '../../util/request/retrievalRequest'
import { addToast } from '../../util/addToast'

export const DownloadHistoryContainer = ({
  authToken,
  earthdataEnvironment
}) => {
  const [retrievalHistory, setRetrievalHistory] = useState([])
  const [retrievalHistoryLoading, setRetrievalHistoryLoading] = useState(false)
  const [retrievalHistoryLoaded, setRetrievalHistoryLoaded] = useState(false)

  const fetchRetrievalHistory = async () => {
    if (!authToken) return

    setRetrievalHistoryLoading(true)

    try {
      const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)
      const response = await requestObject.all()
      const { data } = response

      setRetrievalHistory(data)
      setRetrievalHistoryLoaded(true)
    } catch (error) {
      console.error('Error fetching retrieval history:', error)
    } finally {
      setRetrievalHistoryLoading(false)
    }
  }

  const handleDeleteRetrieval = async (retrievalId) => {
    if (!authToken) return

    try {
      const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)
      await requestObject.remove(retrievalId)

      setRetrievalHistory((prevHistory) => prevHistory.filter((item) => item.id !== retrievalId))

      addToast('Retrieval removed', {
        appearance: 'success',
        autoDismiss: true
      })
    } catch (error) {
      console.error('Error deleting retrieval:', error)

      addToast('Error removing retrieval', {
        appearance: 'error',
        autoDismiss: true
      })
    }
  }

  useEffect(() => {
    fetchRetrievalHistory()
  }, [earthdataEnvironment, authToken])

  return (
    <DownloadHistory
      earthdataEnvironment={earthdataEnvironment}
      retrievalHistory={retrievalHistory}
      retrievalHistoryLoading={retrievalHistoryLoading}
      retrievalHistoryLoaded={retrievalHistoryLoaded}
      onDeleteRetrieval={handleDeleteRetrieval}
    />
  )
}

DownloadHistoryContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  authToken: state.authToken,
  earthdataEnvironment: state.earthdataEnvironment
})

export default withRouter(
  connect(mapStateToProps)(DownloadHistoryContainer)
)
