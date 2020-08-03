import { createSelector } from 'reselect'

import { getFocusedCollectionId } from './focusedCollection'

export const getCollectionsMetadata = (state) => {
  const { metadata = {} } = state
  const { collections = {} } = metadata

  return collections
}

export const getFocusedCollectionMetadata = createSelector(
  [getFocusedCollectionId, getCollectionsMetadata],
  (focusedCollectionId, collectionsMetadata) => {
    const { [focusedCollectionId]: collectionMetadata = {} } = collectionsMetadata

    return collectionMetadata
  }
)
