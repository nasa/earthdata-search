import {
  prepareCollectionParams,
  buildCollectionSearchParams
} from '../util/collections'
import { exactMatch } from '../util/relevancy'

import LoggerRequest from '../util/request/loggerRequest'

/**
 * Send collection relevancy information to lambda to be logged
 */
export const collectionRelevancyMetrics = () => (dispatch, getState) => {
  const state = getState()

  const {
    focusedCollection,
    metadata,
    searchResults
  } = state

  const collectionParams = buildCollectionSearchParams(prepareCollectionParams(state))

  const { collections } = searchResults
  const { allIds, keyword } = collections

  const { collections: collectionMetadata } = metadata
  const { [focusedCollection]: fetchedMetadata } = collectionMetadata

  const data = {
    query: collectionParams,
    collections: allIds,
    selected_index: allIds.indexOf(focusedCollection),
    selected_collection: focusedCollection,
    exact_match: exactMatch(fetchedMetadata, keyword)
  }

  const requestObject = new LoggerRequest()
  requestObject.logRelevancy({ data }).then(() => {})
}

export default collectionRelevancyMetrics
