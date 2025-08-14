import { createSelector } from 'reselect'

import { getGranulesMetadata } from './granuleMetadata'

// eslint-disable-next-line camelcase
import { TEMP_getCollectionId } from './collectionMetadata'

/**
 * Retrieve current collection search information from Redux
 * @param {Object} state Current state of Redux
 */
export const getCollectionsSearch = (state) => {
  const { searchResults = {} } = state
  const { collections = {} } = searchResults

  return collections
}

/**
 * Retrieve search information from Redux pertaining to the granules belonging to the focused collection id
 */
export const getFocusedCollectionGranuleResults = createSelector(
  // eslint-disable-next-line camelcase
  [TEMP_getCollectionId, getCollectionsSearch],
  (focusedCollectionId, collectionsSearch) => {
    const { byId: collectionsSearchById = {} } = collectionsSearch
    const { [focusedCollectionId]: collectionSearch = {} } = collectionsSearchById
    const { granules: collectionGranuleSearch = {} } = collectionSearch

    return collectionGranuleSearch
  }
)

/**
 * Retrieve metadata from Redux pertaining to the granules that have been retrieved as part of a collection search
 */
export const getFocusedCollectionGranuleMetadata = createSelector(
  // eslint-disable-next-line camelcase
  [TEMP_getCollectionId, getCollectionsSearch, getGranulesMetadata],
  (focusedCollectionId, collectionsSearch, granulesMetadata) => {
    const { byId: collectionsSearchById = {} } = collectionsSearch
    const { [focusedCollectionId]: collectionSearch = {} } = collectionsSearchById
    const { granules: collectionGranuleSearch = {} } = collectionSearch
    const { allIds: collectionGranuleIds = [] } = collectionGranuleSearch

    // Extract metadata for granules that are found in `allIds` of the current collection search
    return Object.keys(granulesMetadata)
      .filter((key) => collectionGranuleIds.includes(key))
      .reduce((obj, key) => ({
        ...obj,
        [key]: granulesMetadata[key]
      }), {})
  }
)
