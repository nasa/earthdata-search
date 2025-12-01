import { EdscStore } from '../types'

/**
 * Retrieve the id of the focused collection
 */
export const getCollectionId = (
  state: EdscStore
) => state.collection.collectionId || ''

/**
 * Retrieve the metadata for all fetched collections
 */
export const getCollectionsMetadata = (
  state: EdscStore
) => state.collection.collectionMetadata || {}

/**
 * Retrieve the metadata for the focused collection
 */
export const getFocusedCollectionMetadata = (
  state: EdscStore
) => {
  const collectionId = getCollectionId(state)
  const metadata = getCollectionsMetadata(state)

  return metadata[collectionId] || {}
}

/**
 * Retrieve the subscriptions for the focused collection
 */
export const getFocusedCollectionSubscriptions = (
  state: EdscStore
) => {
  const collectionMetadata = getFocusedCollectionMetadata(state)
  const { subscriptions = {} } = collectionMetadata
  // `subscriptions` can be `null` in some cases. Use an empty object as a fallback.
  const { items = [] } = subscriptions || {}

  return items
}

/**
 * Retrieve the tags for the focused collection
 */
export const getFocusedCollectionTags = (
  state: EdscStore
) => {
  const collectionMetadata = getFocusedCollectionMetadata(state)
  const { tags } = collectionMetadata

  return tags || {}
}
