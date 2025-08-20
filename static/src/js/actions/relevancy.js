import { prepareCollectionParams, buildCollectionSearchParams } from '../util/collections'

import { exactMatch } from '../util/relevancy'

import LoggerRequest from '../util/request/loggerRequest'

import useEdscStore from '../zustand/useEdscStore'
import { getCollectionId, getFocusedCollectionMetadata } from '../zustand/selectors/collection'
import { getCollectionsQuery } from '../zustand/selectors/query'
import { getCollections } from '../zustand/selectors/collections'

/**
 * Send collection relevancy information to lambda to be logged
 */
export const collectionRelevancyMetrics = () => (dispatch, getState) => {
  const state = getState()

  const zustandState = useEdscStore.getState()
  const focusedCollectionId = getCollectionId(zustandState)
  const focusedCollectionMetadata = getFocusedCollectionMetadata(zustandState)
  const collectionsQuery = getCollectionsQuery(zustandState)
  const collections = getCollections(zustandState)

  const { items } = collections
  const allIds = items.map((item) => item.id)

  const { keyword } = collectionsQuery

  const collectionParams = buildCollectionSearchParams(prepareCollectionParams(state))

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
