import 'array-foreach-async'
import AWS from 'aws-sdk'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util'
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

  // Retrieve a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  // Initiate (BEGIN) a database transaction to ensure that no database
  // rows are created and orphaned in the event of an error
  const orderDbTransaction = await dbConnection.transaction()

  try {
    // Fetch the user id from the username in the token
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

      // The relevant tag data is merged into the access method in the UI, this
      // allows us to pull out the type of service and the url that the data will
      // need to be submitted to
      const { type } = accessMethod

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
          // Submits to Catalog Rest and is often referred to as a
          // service order -- this is presenting in EDSC as the 'Customize' access method
          queueUrl = process.env.catalogRestQueueUrl
        } else if (type === 'ECHO ORDERS') {
          // Submits to Legacy Services (CMR) and is often referred to as an
          // echo order -- this is presenting in EDSC as the 'Stage For Delivery' access method
          queueUrl = process.env.legacyServicesQueueUrl
        }

        // Initialize the array we'll send to sqs
        let sqsEntries = []

        await orderPayloads.forEachAsync(async (orderPayload) => {
          // Avoid having to deal with paging again, pull out the page
          // number from the order payload
          const { page_num: pageNum } = orderPayload

          try {
            const newOrderRecord = await orderDbTransaction('retrieval_orders')
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(retrievalRecord[0])
    }
  } catch (e) {
    console.log(e)

    // On error rollback our transaction
    orderDbTransaction.rollback()

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ errors: [e] })
    }
  }
}

export default submitOrder
