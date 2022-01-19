import { createSelector } from 'reselect'

import { extractGranuleSearchParams, prepareGranuleParams } from '../util/granules'
import { prepareSubscriptionQuery } from '../util/subscriptions'

import { getFocusedCollectionId } from './focusedCollection'
import { getFocusedCollectionMetadata } from './collectionMetadata'

/**
 * Retrieve current collection query information from Redux
 * @param {Object} state Current state of Redux
 */
export const getCollectionsQuery = (state) => {
  const { query = {} } = state
  const { collection = {} } = query

  return collection
}

/**
 * Retrieve query information from Redux pertaining to the focused collection id
 */
export const getFocusedCollectionGranuleQuery = createSelector(
  [getFocusedCollectionId, getCollectionsQuery],
  (focusedCollectionId, collectionsQuery) => {
    const { byId: collectionsQueryById = {} } = collectionsQuery
    const { [focusedCollectionId]: collectionQuery = {} } = collectionsQueryById
    const { granules: collectionGranuleQuery = {} } = collectionQuery

    return collectionGranuleQuery
  }
)

export const getFocusedGranuleQueryString = createSelector(
  [(state) => state, getFocusedCollectionMetadata],
  (state, collectionMetadata) => {
    const { id: collectionId } = collectionMetadata
    // Extract granule search parameters from redux specific to the focused collection
    const extractedGranuleParams = extractGranuleSearchParams(state, collectionId)

    const granuleParams = prepareGranuleParams(
      collectionMetadata,
      extractedGranuleParams
    )

    const subscriptionQuery = prepareSubscriptionQuery(granuleParams)

    return subscriptionQuery
  }
)
