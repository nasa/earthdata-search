import { createSelector } from 'reselect'

import { getFocusedCollectionId } from './focusedCollection'

export const getCollectionsQuery = state => state.query.collection

export const getCollectionGranuleQuery = collectionId => createSelector(
  getCollectionsQuery,
  (collectionsQuery) => {
    const { byId: collectionsQueryById = {} } = collectionsQuery
    const { [collectionId]: collectionQuery = {} } = collectionsQueryById
    const { granules: collectionGranuleQuery = {} } = collectionQuery

    return collectionGranuleQuery
  }
)

export const getFocusedCollectionGranuleQuery = createSelector(
  [getFocusedCollectionId, getCollectionsQuery],
  (focusedCollectionId, collectionsQuery) => {
    const { byId: collectionsQueryById = {} } = collectionsQuery
    const { [focusedCollectionId]: collectionQuery = {} } = collectionsQueryById
    const { granules: collectionGranuleQuery = {} } = collectionQuery

    return collectionGranuleQuery
  }
)
