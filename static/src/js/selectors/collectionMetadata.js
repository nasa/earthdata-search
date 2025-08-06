import { createSelector } from 'reselect'
import { getFocusedCollectionId } from '../zustand/selectors/focusedCollection'
import useEdscStore from '../zustand/useEdscStore'

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
  [getCollectionsMetadata],
  (collectionsMetadata) => {
    const focusedCollectionId = getFocusedCollectionId(useEdscStore.getState())

    const { [focusedCollectionId]: collectionMetadata = {} } = collectionsMetadata

    return collectionMetadata
  }
)

/**
 * Retrieve subscriptions from Redux pertaining to the focused collection id
 */
export const getFocusedCollectionSubscriptions = createSelector(
  [getFocusedCollectionMetadata],
  (focusedCollectionMetadata) => {
    const { subscriptions = {} } = focusedCollectionMetadata
    const { items = [] } = subscriptions

    return items
  }
)

/**
 * Retrieve tags from Redux pertaining to the focused collection id
 */
export const getFocusedCollectionTags = createSelector(
  [getFocusedCollectionMetadata],
  (focusedCollectionMetadata) => {
    const { tags } = focusedCollectionMetadata

    return tags || {}
  }
)
