import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import { DownloadHistory } from '../../components/DownloadHistory/DownloadHistory'
import RetrievalRequest from '../../util/request/retrievalRequest'
import addToast from '../../util/addToast'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
import { getEdlToken } from '../../zustand/selectors/user'

const DownloadHistoryContainer = () => {
  const edlToken = useEdscStore(getEdlToken)
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)
  const handleError = useEdscStore((state) => state.errors.handleError)
  const [retrievalHistory, setRetrievalHistory] = useState([])
  const [retrievalHistoryLoadingState, setRetrievalHistoryLoadingState] = useState({
    isLoading: false,
    isLoaded: false
  })

  const fetchRetrievalHistory = useCallback(async () => {
    if (!edlToken) return

    setRetrievalHistoryLoadingState({
      isLoading: true,
      isLoaded: false
    })

    try {
      const requestObject = new RetrievalRequest(edlToken, earthdataEnvironment)
      const response = await requestObject.all()
      const { data } = response

      setRetrievalHistory(data)
      setRetrievalHistoryLoadingState({
        isLoading: false,
        isLoaded: true
      })
    } catch (error) {
      setRetrievalHistoryLoadingState({
        isLoading: false,
        isLoaded: false
      })

      handleError({
        error,
        action: 'fetchRetrievalHistory',
        resource: 'retrieval history',
        verb: 'fetching',
        notificationType: 'banner'
      })
    }
  }, [edlToken, earthdataEnvironment])

  const handleDeleteRetrieval = useCallback(async (retrievalId) => {
    if (!edlToken) return

    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this download from your history? This action cannot be undone.')) {
      try {
        const requestObject = new RetrievalRequest(edlToken, earthdataEnvironment)
        await requestObject.remove(retrievalId)

        setRetrievalHistory((prevHistory) => prevHistory.filter((item) => item.id !== retrievalId))

        addToast('Retrieval removed', {
          appearance: 'success',
          autoDismiss: true
        })
      } catch (error) {
        handleError({
          error,
          action: 'handleDeleteRetrieval',
          resource: 'retrieval',
          verb: 'deleting',
          notificationType: 'banner'
        })
      }
    }
  }, [edlToken, earthdataEnvironment])

  useEffect(() => {
    if (edlToken) {
      fetchRetrievalHistory()
    }
  }, [fetchRetrievalHistory])

  return (
    <DownloadHistory
      earthdataEnvironment={earthdataEnvironment}
      retrievalHistory={retrievalHistory}
      retrievalHistoryLoading={retrievalHistoryLoadingState.isLoading}
      retrievalHistoryLoaded={retrievalHistoryLoadingState.isLoaded}
      onDeleteRetrieval={handleDeleteRetrieval}
    />
  )
}

export default DownloadHistoryContainer
