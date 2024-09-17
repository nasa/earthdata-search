import 'array-foreach-async'
import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import snakecaseKeys from 'snakecase-keys'

import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { generateRetrievalPayloads } from './generateRetrievalPayloads'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { removeSpatialFromAccessMethod } from '../util/removeSpatialFromAccessMethod'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

// AWS SQS adapter
let sqs

/**
 * Saves a retrieval to the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const submitRetrieval = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event
  const { params = {} } = JSON.parse(body)

  const { collections, environment, json_data: jsonData } = params

  const jwtToken = getJwtToken(event)

  if (sqs == null) {
    sqs = new SQSClient(getSqsConfig())
  }

  const {
    access_token: accessToken,
    user_id: userId
  } = await getAccessTokenFromJwtToken(jwtToken, environment)

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  // Initiate (BEGIN) a database transaction to ensure that no database
  // rows are created and orphaned in the event of an error
  const retrievalDbTransaction = await dbConnection.transaction()

  try {
    const retrievalRecord = await retrievalDbTransaction('retrievals')
      .returning(['id', 'user_id', 'environment', 'jsondata'])
      .insert({
        user_id: userId,
        environment,
        token: accessToken,
        jsondata: jsonData
      })

    await collections.forEachAsync(async (collection) => {
      const {
        id,
        access_method: accessMethod,
        collection_metadata: collectionMetadata,
        granule_count: granuleCount = 0,
        granule_link_count: granuleLinkCount = 0,
        granule_params: granuleParams
      } = collection

      // Snake case the granule params for sending to CMR
      const snakeGranuleParams = snakecaseKeys(granuleParams)

      const newRetrievalCollection = await retrievalDbTransaction('retrieval_collections')
        .returning([
          'id',
          'access_method',
          'collection_id',
          'collection_metadata',
          'granule_params',
          'granule_count',
          'granule_link_count'
        ])
        .insert({
          retrieval_id: retrievalRecord[0].id,
          access_method: accessMethod,
          collection_id: id,
          collection_metadata: collectionMetadata,
          granule_params: snakeGranuleParams,
          granule_count: granuleCount,
          granule_link_count: granuleLinkCount
        })

      // Save Access Configuration
      const existingAccessConfig = await retrievalDbTransaction('access_configurations')
        .select('id')
        .where({
          user_id: userId,
          collection_id: id
        })

      const accessMethodWithoutSpatial = removeSpatialFromAccessMethod(accessMethod)

      if (existingAccessConfig.length) {
        await retrievalDbTransaction('access_configurations')
          .update({
            access_method: accessMethodWithoutSpatial
          })
          .where({
            user_id: userId,
            collection_id: id
          })
      } else {
        await retrievalDbTransaction('access_configurations')
          .insert({
            user_id: userId,
            collection_id: id,
            access_method: accessMethodWithoutSpatial
          })
      }

      // The relevant tag data is merged into the access method in the UI, this
      // allows us to pull out the type of service and the url that the data will
      // need to be submitted to
      const { type } = accessMethod

      if (['ESI', 'ECHO ORDERS', 'Harmony', 'SWODLR'].includes(type)) {
        // The insert above returns an array but we've only added a single row
        // so we will always take the first result
        const [retrievalCollection] = newRetrievalCollection

        const { id: retrievalCollectionId } = retrievalCollection

        // Provide the inserted row to the generateOrder payload to construct
        // the payloads we need to submit the users' order
        const orderPayloads = await generateRetrievalPayloads(retrievalCollection, accessMethod)

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
        } else if (type === 'SWODLR') {
          queueUrl = process.env.swodlrQueueUrl
        }

        // Initialize the array we'll send to sqs
        let sqsEntries = []

        await orderPayloads.forEachAsync(async (orderPayload) => {
          // Avoid having to deal with paging again, pull out the page
          // number from the order payload
          const { page_num: pageNum } = orderPayload
          // Some CMR access-control calls downstream can take quite a long time
          // if you give it too many granules at once, so lets delay each
          // sqs entry by ORDER_DELAY_SECONDS value for each page. i.e. page 1
          // will not wait, page 2 will wait ORDER_DELAY_SECONDS, page 3 will wait
          // ORDER_DELAY_SECONDS times 2, etc.
          const delay = (pageNum - 1) * parseInt(process.env.orderDelaySeconds, 10)

          try {
            const newOrderRecord = await retrievalDbTransaction('retrieval_orders')
              .returning(['id'])
              .insert({
                retrieval_collection_id: retrievalCollectionId,
                type,
                granule_params: orderPayload
              })

            // Push the orders into an array that will be bulk pushed to SQS
            sqsEntries.push({
              Id: `${retrievalCollectionId}-${pageNum}`,
              MessageBody: JSON.stringify({
                accessToken,
                id: newOrderRecord[0].id
              }),
              // Wait a few seconds before picking up the SQS job to ensure the database transaction
              // has been committed. Here we add the ORDER_DELAY_SECONDS as well.
              DelaySeconds: 3 + delay
            })
          } catch (error) {
            parseError(error)
          }

          if (!process.env.IS_OFFLINE) {
            // MessageBatch only accepts batch sizes of 10 messages, so we'll
            // chunk potentially larger request into acceptable chunks
            if (pageNum % 10 === 0 || pageNum === orderPayloads.length) {
              // Send all of the order messages to sqs as a single batch
              const command = new SendMessageBatchCommand({
                QueueUrl: queueUrl,
                Entries: sqsEntries
              })
              await sqs.send(command)
              sqsEntries = []
            }
          }
        })
      }
    })

    await retrievalDbTransaction.commit()

    // Insert returns an array but we know that we're only inserting a
    // single record so pop the first result row
    const [newRetrieval] = retrievalRecord

    // Encode the id of our new record before returning it
    const response = {
      ...newRetrieval,
      id: obfuscateId(newRetrieval.id)
    }

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(response)
    }
  } catch (error) {
    // On error rollback our transaction
    retrievalDbTransaction.rollback()

    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default submitRetrieval
