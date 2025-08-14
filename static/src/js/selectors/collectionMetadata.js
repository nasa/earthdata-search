import { createSelector } from 'reselect'
import { getCollectionId } from '../zustand/selectors/collection'
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
 * Temporary selector to retrieve the focused collection id from Zustand. This
 * will be removed when the Redux selectors using it are moved to Zustand.
 */
// eslint-disable-next-line camelcase
export const TEMP_getCollectionId = () => getCollectionId(useEdscStore.getState())

/**
 * Retrieve metadata from Redux pertaining to the focused collection id
 */
export const getFocusedCollectionMetadata = createSelector(
  // eslint-disable-next-line camelcase
  [TEMP_getCollectionId, getCollectionsMetadata],
  (focusedCollectionId, collectionsMetadata) => {
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
