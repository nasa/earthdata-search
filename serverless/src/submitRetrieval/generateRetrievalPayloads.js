import 'array-foreach-async'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { getGranuleLimit } from '../../../static/src/js/util/collectionMetadata/granuleLimit'
import { hasTag } from '../../../sharedUtils/tags'
import { limitedCollectionSize } from '../../../sharedUtils/limitedCollectionSize'

/**
 * Determine if the provided collection is limited by the provider
 * @param {Object} collectionMetadata CMR Collection metadata
 */
const isLimitedCollection = (collectionMetadata) => {
  // Limited collections don't use the standard 'edsc.extra' namespace
  hasTag(collectionMetadata, 'limited_collections', 'edsc')
}

/**
 * Determine the maximum number of granules a user can request per order
 * @param {Object} collectionMetadata CMR Collection metadata
 */
const maxGranulesPerOrder = (collectionMetadata) => {
  const { defaultGranulesPerOrder } = getApplicationConfig()

  if (isLimitedCollection(collectionMetadata)) {
    // Return the mininum between the default order size and the collection granuleLimit
    return Math.min(defaultGranulesPerOrder, getGranuleLimit(collectionMetadata))
  }

  return defaultGranulesPerOrder
}

/**
 * Determine the size of the order adjusting for caps and provider limitations
 * @param {Object} collectionMetadata CMR Collection metadata
 * @param {Integer} granuleCount The number of granules requested by the user
 */
const adjustedGranuleCount = (collectionMetadata, granuleCount) => {
  const consideredSizes = [getApplicationConfig().defaultMaxOrderSize, granuleCount]

  if (isLimitedCollection(collectionMetadata)) {
    consideredSizes.push(limitedCollectionSize(collectionMetadata))
  }

  return Math.min(...consideredSizes)
}

/**
 * Generate a chunked array of objects ready to send to CMR
 * @param {Object} retrievalCollection Retrieval Collection response from the database
 */
export async function generateRetrievalPayloads(retrievalCollection) {
  const {
    collection_metadata: collectionMetadata = {},
    granule_count: granuleCount,
    granule_params: granuleParams
  } = retrievalCollection

  // Determine the size of the entire order
  const orderGranuleCount = adjustedGranuleCount(collectionMetadata, granuleCount)

  // Determine the size of each chunked order adjusting for provider limitations
  const pageSize = maxGranulesPerOrder(collectionMetadata)

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
