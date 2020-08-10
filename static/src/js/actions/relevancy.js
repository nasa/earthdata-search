import {
  prepareCollectionParams,
  buildCollectionSearchParams
} from '../util/collections'

import { exactMatch } from '../util/relevancy'
import { getFocusedCollectionId } from '../selectors/focusedCollection'
import { getFocusedCollectionMetadata } from '../selectors/collectionMetadata'

import LoggerRequest from '../util/request/loggerRequest'

/**
 * Send collection relevancy information to lambda to be logged
 */
export const collectionRelevancyMetrics = () => (dispatch, getState) => {
  const state = getState()

  const {
    searchResults
  } = state

  // Retrieve data from Redux using selectors
  const focusedCollectionId = getFocusedCollectionId(state)
  const focusedCollectionMetadata = getFocusedCollectionMetadata(state)

  const collectionParams = buildCollectionSearchParams(prepareCollectionParams(state))

  const { collections } = searchResults
  const { allIds, keyword } = collections

  const data = {
    query: collectionParams,
    collections: allIds,
    selected_index: allIds.indexOf(focusedCollectionId),
    selected_collection: focusedCollectionId,
    exact_match: exactMatch(focusedCollectionMetadata, keyword)
  }

  const requestObject = new LoggerRequest()

  requestObject.logRelevancy({ data }).then(() => {})
}

export default collectionRelevancyMetrics
