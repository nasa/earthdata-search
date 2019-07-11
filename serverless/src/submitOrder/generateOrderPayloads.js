import 'array-foreach-async'
import { getValueForTag, hasTag } from '../../../sharedUtils/tags'

// Maxium number of granules any order can request from cmr or legacy services
const DEFAULT_MAX_ORDER_SIZE = 1000000

// Default number of granules for chunked orders, overwritten only by limited collections
const DEFAULT_GRANULES_PER_ORDER = 2000

/**
 * Determine if the provided collection is limited by the provider
 * @param {Object} collectionMetadata CMR Collection metadata
 */
const isLimitedCollection = (collectionMetadata) => {
  // Limited collections don't use the standard 'edsc.extra' namespace
  hasTag(collectionMetadata, 'limited_collections', 'edsc')
}

/**
 * Retrieve the value stored within the limited collection tag for a provided collection
 * @param {Object} collectionMetadata CMR Collection metadata
 */
const limitedCollectionSize = (collectionMetadata) => {
  const { tags } = collectionMetadata

  const { limit } = getValueForTag(tags, 'limited_collections', 'edsc')

  return limit
}

/**
 * Determine the maximum number of granules a user can request per order
 * @param {Object} collectionMetadata CMR Collection metadata
 */
const maxOrderSize = (collectionMetadata) => {
  if (isLimitedCollection(collectionMetadata)) {
    return limitedCollectionSize(collectionMetadata)
  }

  return DEFAULT_GRANULES_PER_ORDER
}

/**
 * Determine the size of the order adjusting for caps and provider limitations
 * @param {Object} collectionMetadata CMR Collection metadata
 * @param {Integer} granuleCount The number of granules requested by the user
 */
const adjustedGranuleCount = (collectionMetadata, granuleCount) => {
  const consideredSizes = [DEFAULT_MAX_ORDER_SIZE, granuleCount]

  if (isLimitedCollection(collectionMetadata)) {
    consideredSizes.push(limitedCollectionSize(collectionMetadata))
  }

  return Math.min(...consideredSizes)
}

export async function generateOrderPayloads(retrievalCollection) {
  const {
    collection_metadata: collectionMetadata = {},
    granule_count: granuleCount,
    granule_params: granuleParams
  } = retrievalCollection

  // Determine the size of the entire order
  const orderGranuleCount = adjustedGranuleCount(collectionMetadata, granuleCount)

  // Determine the size of each chunked order adjusting for provider limitations
  const pageSize = maxOrderSize(collectionMetadata)

  // Determine how many orders we'll need to create given how many
  // granules the user requested
  const totalPages = Math.ceil(orderGranuleCount / pageSize)

  const orderPayloads = []

  Array.from(Array(totalPages)).forEach((_, pageNum) => {
    const adjustedPageNumber = pageNum + 1

    orderPayloads.push({
      ...granuleParams,

      // Override these values if they were provided with the current iterations values
      page_num: adjustedPageNumber,
      page_size: pageSize
    })
  })

  return orderPayloads
}
