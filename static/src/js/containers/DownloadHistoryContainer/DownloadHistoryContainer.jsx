import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import { DownloadHistory } from '../../components/DownloadHistory/DownloadHistory'
import RetrievalRequest from '../../util/request/retrievalRequest'
import { addToast } from '../../util/addToast'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  earthdataEnvironment: state.earthdataEnvironment
})

export const mapDispatchToProps = (dispatch) => ({
  dispatchHandleError: (errorConfig) => dispatch(actions.handleError(errorConfig))
})

export const DownloadHistoryContainer = ({
  authToken,
  earthdataEnvironment,
  dispatchHandleError
}) => {
  const [retrievalHistory, setRetrievalHistory] = useState([])
  const [retrievalHistoryLoading, setRetrievalHistoryLoading] = useState(false)
  const [retrievalHistoryLoaded, setRetrievalHistoryLoaded] = useState(false)

  const fetchRetrievalHistory = useCallback(async () => {
    if (!authToken) return

    setRetrievalHistoryLoading(true)

    try {
      const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)
      const response = await requestObject.all()
      const { data } = response

      setRetrievalHistory(data)
      setRetrievalHistoryLoaded(true)
    } catch (error) {
      dispatchHandleError({
        error,
        action: 'fetchRetrievalHistory',
        resource: 'retrieval history',
        verb: 'fetching',
        notificationType: 'banner'
      })
    } finally {
      setRetrievalHistoryLoading(false)
    }
  }, [authToken, earthdataEnvironment, dispatchHandleError])

  const handleDeleteRetrieval = useCallback(async (retrievalId) => {
    if (!authToken) return

    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this download from your history? This action cannot be undone.')) {
      try {
        const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)
        await requestObject.remove(retrievalId)

        setRetrievalHistory((prevHistory) => prevHistory.filter((item) => item.id !== retrievalId))

        addToast('Retrieval removed', {
          appearance: 'success',
          autoDismiss: true
        })
      } catch (error) {
        dispatchHandleError({
          error,
          action: 'handleDeleteRetrieval',
          resource: 'retrieval',
          verb: 'deleting',
          notificationType: 'banner'
        })
      }
    }
  }, [authToken, earthdataEnvironment, dispatchHandleError])

  useEffect(() => {
    if (authToken) {
      fetchRetrievalHistory()
    }
  }, [fetchRetrievalHistory])

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
  earthdataEnvironment: PropTypes.string.isRequired,
  dispatchHandleError: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DownloadHistoryContainer)
)
