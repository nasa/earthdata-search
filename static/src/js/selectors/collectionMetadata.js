import { createSelector } from 'reselect'

import { getFocusedCollectionId } from './focusedCollection'

/**
 * Retrieve all collection metadata from Redux
 * @param {Object} state Current state of Redux
 */
export const getCollectionsMetadata = (state) => {
  const { metadata = {} } = state
  const { collections = {} } = metadata

  return collections
}

/**
 * Retrieve metadata from Redux pertaining to the focused collection id
 */
export const getFocusedCollectionMetadata = createSelector(
  [getFocusedCollectionId, getCollectionsMetadata],
  (focusedCollectionId, collectionsMetadata) => {
    const { [focusedCollectionId]: collectionMetadata = {} } = collectionsMetadata

    return collectionMetadata
  }
)
