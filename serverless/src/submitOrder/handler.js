import 'array-foreach-async'
import 'pg'
import AWS from 'aws-sdk'

// import jwt from 'jsonwebtoken'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util'
// import { getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { generateOrderPayloads } from './generateOrderPayloads'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getUsernameFromToken } from '../util/getUsernameFromToken'

// Knex database connection object
let dbConnection = null

// AWS SQS adapter
let sqs

const submitOrder = async (event) => {
  const { body } = event
  const { params = {} } = JSON.parse(body)
  const { collections, environment, json_data: jsonData } = params

  sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

  const jwtToken = getJwtToken(event)

  const { token } = getVerifiedJwtToken(jwtToken)
  const { access_token: accessToken } = token
  const username = getUsernameFromToken(token)

  // Retrive a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  const orderDbTransaction = await dbConnection.transaction()

  try {
    const userRecord = await orderDbTransaction('users').first('id').where({ urs_id: username })

    const retrievalRecord = await orderDbTransaction('retrievals')
      .returning(['id', 'user_id', 'environment', 'jsondata'])
      .insert({
        user_id: userRecord.id,
        environment,
        token: accessToken,
        jsondata: jsonData
      })

    await collections.forEachAsync(async (collection) => {
      const {
        id,
        access_method: accessMethod,
        collection_metadata: collectionMetadata,
        granule_count: granuleCount,
        granule_params: granuleParams
      } = collection

      const newRetrievalCollection = await orderDbTransaction('retrieval_collections')
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
          granule_params: granuleParams,
          granule_count: granuleCount
        })

      // Save Access Configuration
      const existingAccessConfig = await orderDbTransaction('access_configurations')
        .select('id')
        .where({ user_id: userRecord.id, collection_id: id })

      if (existingAccessConfig.length) {
        await orderDbTransaction('access_configurations')
          .update({
            access_method: accessMethod
          })
          .where({ user_id: userRecord.id, collection_id: id })
      } else {
        await orderDbTransaction('access_configurations')
          .insert({
            user_id: userRecord.id,
            collection_id: id,
            access_method: accessMethod
          })
      }

      const { type, url } = accessMethod

      if (['ESI', 'ECHO ORDERS'].includes(type)) {
        // The insert above returns an array but we've only added a single row
        // so we will always take the first result
        const [retrievalCollection] = newRetrievalCollection

        const { id: retrievalCollectionId } = retrievalCollection

        // Provide the inserted row to the generateOrder payload to construct
        // the payloads we need to submit the users' order
        const orderPayloads = await generateOrderPayloads(retrievalCollection)

        let queueUrl

        if (type === 'ESI') {
          queueUrl = process.env.legacyServicesQueueUrl
        } else if (type === 'ECHO ORDERS') {
          queueUrl = process.env.catalogRestQueueUrl
        }

        // Initialize the array we'll send to sqs
        let sqsEntries = []

        await orderPayloads.forEachAsync(async (orderPayload) => {
          const { page_num: pageNum } = orderPayload
          try {
            const newOrderRecord = await orderDbTransaction('retrieval_orders')
              .returning(['id', 'granule_params'])
              .insert({
                retrieval_collection_id: retrievalCollectionId,
                type,
                granule_params: orderPayload
              })

            sqsEntries.push({
              Id: `${retrievalCollectionId}-${pageNum}`,
              MessageBody: JSON.stringify({
                ...newOrderRecord,
                url
              })
            })
          } catch (e) {
            console.log(e)
          }

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
        })
      }
    })

    await orderDbTransaction.commit()

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(retrievalRecord[0])
    }
  } catch (e) {
    console.log(e)

    // On error rollback our transaction
    orderDbTransaction.rollback()

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [e] })
    }
  }
}

export default submitOrder
