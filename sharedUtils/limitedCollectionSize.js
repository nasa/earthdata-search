import { getValueForTag } from './tags'

/**
 * Retrieve the value stored within the limited collection tag for a provided collection
 * @param {Object} collectionMetadata CMR Collection metadata
 */
export const limitedCollectionSize = (collectionMetadata) => {
  const { tags } = collectionMetadata

  const { limit } = getValueForTag('limited_collections', tags, 'edsc') || {}

  return limit
}
