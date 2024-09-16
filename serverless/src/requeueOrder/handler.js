import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { getDbConnection } from '../util/database/getDbConnection'

// AWS SQS adapter
let sqsClient

/**
 * Requeues an order onto an SQS queue for processing
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const requeueOrder = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event
  const { params = {} } = JSON.parse(body)

  const { orderId } = params

  if (sqsClient == null) {
    sqsClient = new SQSClient(getSqsConfig())
  }

  // Fetch order from database to find the type of order

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const [retrievalOrder] = await dbConnection('retrieval_orders')
    .select(
      'retrieval_orders.retrieval_collection_id',
      'retrieval_orders.type',
      'retrievals.token'
    )
    .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
    .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
    .where({ 'retrieval_orders.id': orderId })

  // Add the order to the correct sqs queue based on order type
  const {
    retrieval_collection_id: retrievalCollectionId,
    token: accessToken,
    type
  } = retrievalOrder

  if (['ESI', 'ECHO ORDERS', 'Harmony'].includes(type)) {
    let queueUrl

    if (type === 'ESI') {
      // Submits to Catalog Rest and is often referred to as a
      // service order -- this is presenting in EDSC as the 'Customize' access method
      queueUrl = process.env.catalogRestQueueUrl
    } else if (type === 'ECHO ORDERS') {
      // Submits to cmr-ordering and is often referred to as an
      // echo order -- this is presenting in EDSC as the 'Stage For Delivery' access method
      queueUrl = process.env.cmrOrderingOrderQueueUrl
    } else if (type === 'Harmony') {
      // Submits to Harmony
      queueUrl = process.env.harmonyQueueUrl
    }

    if (!process.env.IS_OFFLINE) {
      // Send all of the order messages to sqs as a single batch
      await sqsClient.send(new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: [{
          Id: `${retrievalCollectionId}`,
          MessageBody: JSON.stringify({
            accessToken,
            id: orderId
          })
        }]
      }))
    }
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: defaultResponseHeaders,
    body: JSON.stringify({ orderId })
  }
}

export default requeueOrder
