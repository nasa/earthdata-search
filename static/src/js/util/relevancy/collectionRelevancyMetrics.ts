// @ts-expect-error This file does not have types
import { prepareCollectionParams, buildCollectionSearchParams } from '../collections'

// @ts-expect-error This file does not have types
import { exactMatch } from './relevancy'

// @ts-expect-error This file does not have types
import LoggerRequest from '../request/loggerRequest'

import { getCollectionId, getFocusedCollectionMetadata } from '../../zustand/selectors/collection'
import { getCollections } from '../../zustand/selectors/collections'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import useEdscStore from '../../zustand/useEdscStore'
import logEvent from '../metrics/experiments/logEvent'

/**
 * Send collection relevancy information to lambda to be logged
 */
export const collectionRelevancyMetrics = () => {
  const zustandState = useEdscStore.getState()
  const focusedCollectionId = getCollectionId(zustandState)
  const focusedCollectionMetadata = getFocusedCollectionMetadata(zustandState)
  const collectionsQuery = getCollectionsQuery(zustandState)
  const collections = getCollections(zustandState)

  const { items } = collections
  const allIds = items.map((item) => item.id)

  const { keyword } = collectionsQuery

  const collectionParams = buildCollectionSearchParams(prepareCollectionParams({}))

  const selectedIndex = allIds.indexOf(focusedCollectionId)

  const data = {
    query: collectionParams,
    collections: allIds,
    selected_index: selectedIndex,
    selected_collection: focusedCollectionId,
    exact_match: exactMatch(focusedCollectionMetadata, keyword)
  }

  const requestObject = new LoggerRequest()

  requestObject.logRelevancy({ data }).then(() => {})

  // Log the collection relevancy event to GrowthBook
  logEvent({
    eventData: JSON.stringify({
      selected_index: selectedIndex
    }),
    eventType: 'collection_relevancy'
  })
}
