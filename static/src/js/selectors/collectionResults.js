import { createSelector } from 'reselect'

import { getFocusedCollectionId } from './focusedCollection'
import { getGranulesMetadata } from './granuleMetadata'

export const getCollectionsSearch = (state) => {
  const { searchResults = {} } = state
  const { collections = {} } = searchResults

  return collections
}

export const getFocusedCollectionGranuleResults = createSelector(
  [getFocusedCollectionId, getCollectionsSearch],
  (focusedCollectionId, collectionsSearch) => {
    const { byId: collectionsSearchById = {} } = collectionsSearch
    const { [focusedCollectionId]: collectionSearch = {} } = collectionsSearchById
    const { granules: collectionGranuleSearch = {} } = collectionSearch

    return collectionGranuleSearch
  }
)

export const getFocusedCollectionGranuleMetadata = createSelector(
  [getFocusedCollectionId, getCollectionsSearch, getGranulesMetadata],
  (focusedCollectionId, collectionsSearch, granulesMetadata) => {
    const { byId: collectionsSearchById = {} } = collectionsSearch
    const { [focusedCollectionId]: collectionSearch = {} } = collectionsSearchById
    const { granules: collectionGranuleSearch = {} } = collectionSearch
    const { allIds: collectionGranuleIds = [] } = collectionGranuleSearch

    return Object.keys(granulesMetadata)
      .filter(key => collectionGranuleIds.includes(key))
      .reduce((obj, key) => ({
        ...obj,
        [key]: granulesMetadata[key]
      }), {})
  }
)
