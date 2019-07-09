import 'array-foreach-async'
import { SQS } from 'aws-sdk'
import { getDbConnection } from '../util/database/getDbConnection'
import { getValueForTag, hasTag } from '../../../sharedUtils/tags'

let sqs

const DEFAULT_MAX_ORDER_SIZE = 1000000
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

export async function queueOrders(queueUrl, currentDbConnection, {
  id,
  access_method: accessMethod,
  collection_metadata: collectionMetadata = {},
  granule_count: granuleCount,
  granule_params: granuleParams
}) {
  // Retrive a connection to the database
  const dbConnection = await getDbConnection(currentDbConnection)

  if (!sqs) {
    sqs = new SQS({ apiVersion: '2012-11-05' })
  }

  const orderGranuleCount = adjustedGranuleCount(collectionMetadata, granuleCount)

  // Determine the size of each chunked order adjusting for provider limitations
  const pageSize = maxOrderSize(collectionMetadata)

  // Determine how many orders we'll need to create given how many
  // granules the user requested
  const totalPages = Math.ceil(orderGranuleCount / pageSize)

  const { url: orderEndpoint } = accessMethod

  const sqsEntries = []

  await Array.from(Array(totalPages)).forEachAsync(async (_, pageNum) => {
    try {
      const newOrderRecord = await dbConnection('retrieval_orders').returning([
        'id',
        'granule_params'
      ]).insert({
        retrieval_collection_id: id,
        granule_params: {
          ...granuleParams,

          // Override these values if they were provided with the current iterations values
          page_num: pageNum + 1,
          page_size: pageSize
        }
      })

      console.log(newOrderRecord)

      sqsEntries.push({
        MessageBody: JSON.stringify({
          ...newOrderRecord,
          orderEndpoint
        })
      })

      console.log(sqsEntries)
    } catch (e) {
      console.log(e)
    }
  })

  // Send all of the order messages to sqs as a single batch
  await sqs.sendMessageBatch({
    QueueUrl: queueUrl,
    Entries: sqsEntries
  }).promise()
}
