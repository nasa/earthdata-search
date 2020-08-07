import { createSelector } from 'reselect'

import { getFocusedCollectionId } from './focusedCollection'

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
