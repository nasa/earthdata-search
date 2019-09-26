import { prepareCollectionParams, buildCollectionSearchParams } from '../util/collections'
import LoggerRequest from '../util/request/loggerRequest'
import { exactMatch } from '../util/relevancy'

/**
 * Send collection relevancy information to lambda to be logged
 */
export const collectionRelevancyMetrics = () => (dispatch, getState) => {
  const state = getState()
  const {
    focusedCollection,
    searchResults
  } = state

  const collectionParams = buildCollectionSearchParams(prepareCollectionParams(state))

  const { collections } = searchResults
  const { allIds, byId, keyword } = collections
  const metadata = byId[focusedCollection]

  if (!metadata) return

  const data = {
    query: collectionParams,
    collections: allIds,
    selected_index: allIds.indexOf(focusedCollection),
    selected_collection: focusedCollection,
    exact_match: exactMatch(metadata, keyword)
  }

  const requestObject = new LoggerRequest()
  requestObject.logRelevancy({ data }).then(() => {})
}

export default collectionRelevancyMetrics
