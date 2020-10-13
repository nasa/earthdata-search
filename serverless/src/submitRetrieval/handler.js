import 'array-foreach-async'
import AWS from 'aws-sdk'
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
    sqs = new AWS.SQS(getSqsConfig())
  }

  const {
    access_token: accessToken,
    user_id: userId
  } = await getAccessTokenFromJwtToken(jwtToken)

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
          'granule_count'
        ])
        .insert({
          retrieval_id: retrievalRecord[0].id,
          access_method: accessMethod,
          collection_id: id,
          collection_metadata: collectionMetadata,
          granule_params: snakeGranuleParams,
          granule_count: granuleCount
        })

      // Save Access Configuration
      const existingAccessConfig = await retrievalDbTransaction('access_configurations')
        .select('id')
        .where({ user_id: userId, collection_id: id })

      const accessMethodWithoutSpatial = removeSpatialFromAccessMethod(accessMethod)

      if (existingAccessConfig.length) {
        await retrievalDbTransaction('access_configurations')
          .update({
            access_method: accessMethodWithoutSpatial
          })
          .where({ user_id: userId, collection_id: id })
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

      if (['ESI', 'ECHO ORDERS', 'Harmony'].includes(type)) {
        // The insert above returns an array but we've only added a single row
        // so we will always take the first result
        const [retrievalCollection] = newRetrievalCollection

        const { id: retrievalCollectionId } = retrievalCollection

        // Provide the inserted row to the generateOrder payload to construct
        // the payloads we need to submit the users' order
        const orderPayloads = await generateRetrievalPayloads(retrievalCollection)

        let queueUrl

        if (type === 'ESI') {
          // Submits to Catalog Rest and is often referred to as a
          // service order -- this is presenting in EDSC as the 'Customize' access method
          queueUrl = process.env.catalogRestQueueUrl
        } else if (type === 'ECHO ORDERS') {
          // Submits to Legacy Services (CMR) and is often referred to as an
          // echo order -- this is presenting in EDSC as the 'Stage For Delivery' access method
          queueUrl = process.env.legacyServicesQueueUrl
        } else if (type === 'Harmony') {
          // Submits to Harmony
          queueUrl = process.env.harmonyQueueUrl
        }

        // Initialize the array we'll send to sqs
        let sqsEntries = []

        await orderPayloads.forEachAsync(async (orderPayload) => {
          // Avoid having to deal with paging again, pull out the page
          // number from the order payload
          const { page_num: pageNum } = orderPayload

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
              })
            })
          } catch (e) {
            console.log(e)
          }

          if (!process.env.IS_OFFLINE) {
            // MessageBatch only accepts batch sizes of 10 messages, so we'll
            // chunk potentially larger request into acceptable chunks
            if (pageNum % 10 === 0 || pageNum === orderPayloads.length) {
              // Send all of the order messages to sqs as a single batch
              try {
                await sqs.sendMessageBatch({
                  QueueUrl: queueUrl,
                  Entries: sqsEntries
                }).promise()
              } catch (e) {
                console.log(e)
              }

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
  } catch (e) {
    // On error rollback our transaction
    retrievalDbTransaction.rollback()

    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default submitRetrieval
