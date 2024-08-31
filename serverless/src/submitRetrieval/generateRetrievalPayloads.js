import 'array-foreach-async'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { getGranuleLimit } from '../../../static/src/js/util/collectionMetadata/granuleLimit'
import { maxSwodlrGranuleCount } from '../../../static/src/js/constants/swodlrConstants'
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
const maxGranulesPerOrder = (collectionMetadata, accessMethod) => {
  const { defaultGranulesPerOrder } = getApplicationConfig()

  const { maxItemsPerOrder, type } = accessMethod

  // Each swodlr order must be parsed separately
  if (type === 'SWODLR') {
    return 1
  }

  if (maxItemsPerOrder || isLimitedCollection(collectionMetadata)) {
    // Return the minimum between the default order size and the collection granuleLimit
    return Math.min(maxItemsPerOrder, defaultGranulesPerOrder, getGranuleLimit(collectionMetadata))
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
export async function generateRetrievalPayloads(retrievalCollection, accessMethod) {
  const {
    collection_metadata: collectionMetadata = {},
    granule_count: granuleCount,
    granule_params: granuleParams
  } = retrievalCollection

  // Determine the size of the entire order
  const orderGranuleCount = adjustedGranuleCount(collectionMetadata, granuleCount)

  // Determine the size of each chunked order adjusting for provider limitations
  const pageSize = maxGranulesPerOrder(collectionMetadata, accessMethod)
  console.log('🚀 ~ file: generateRetrievalPayloads.js:71 ~ generateRetrievalPayloads ~ pageSize:', pageSize)

  // Determine how many orders we'll need to create given how many
  // granules the user requested
  const totalPages = Math.ceil(orderGranuleCount / pageSize)
  console.log('🚀 ~ file: generateRetrievalPayloads.js:75 ~ generateRetrievalPayloads ~ totalPages:', totalPages)

  const orderPayloads = []

  Array.from(Array(totalPages)).forEach((_, pageNum) => {
    const adjustedPageNumber = pageNum + 1

    const { concept_id: conceptId } = granuleParams

    let conceptIds = conceptId
    // TODO I want ot pu one additional guard here to prevent > 10 orders from getting written into the database
    if (accessMethod.type === 'SWODLR') {
      console.log('🚀 ~ file: generateRetrievalPayloads.js:87 ~ Array.from ~ pageNum:', pageNum)
      // TODO: adjustedPageNumber vs pageNum????
      if (adjustedPageNumber > maxSwodlrGranuleCount) {
        console.log('🚀 ~ file: generateRetrievalPayloads.js:83 ~ Array.from ~ conceptIds:', conceptIds)
        console.log('🚀 ~ file: generateRetrievalPayloads.js:89 ~ Array.from ~ pageNum:', pageNum)
        throw new Error('Swodlr too many granules at retrieval')
      }

      conceptIds = [conceptId[pageNum]]
    }

    orderPayloads.push({
      ...granuleParams,

      // Override these values if they were provided with the current iterations values
      page_num: adjustedPageNumber,
      page_size: pageSize,
      concept_id: conceptIds
    })
  })

  return orderPayloads
}
