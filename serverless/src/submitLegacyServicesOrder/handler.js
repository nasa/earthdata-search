import 'array-foreach-async'
import AWS from 'aws-sdk'
import request from 'request-promise'
import { getClientId, getEarthdataConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { constructOrderPayload } from './constructOrderPayload'
import { constructUserInformationPayload } from './constructUserInformationPayload'
import { getEdlConfig } from '../configUtil'
import { startOrderStatusUpdateWorkflow } from '../util/orderStatus'

// Knex database connection object
let dbConnection = null

let sqs

const submitLegacyServicesOrder = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Retrieve a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  if (!sqs) {
    sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
  }

  const { Records: sqsRecords = [] } = event

  console.log(`Processing ${sqsRecords.length} order(s)`)

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

    // Destruct the payload from SQS
    const {
      accessToken,
      id
    } = JSON.parse(body)

    const edlConfig = await getEdlConfig()
    const { client } = edlConfig
    const { id: clientId } = client

    const accessTokenWithClient = `${accessToken}:${clientId}`

    // Fetch the retrieval id that the order belongs to so that we can provide a link to the status page
    const retrievalRecord = await dbConnection('retrieval_orders')
      .first(
        'retrievals.id',
        'retrieval_collections.access_method',
        'retrieval_collections.granule_params',
        'users.echo_profile',
        'users.urs_profile'
      )
      .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrieval_orders.id': id
      })

    const {
      access_method: accessMethod,
      granule_params: granuleParams,
      echo_profile: echoProfile,
      urs_profile: ursProfile
    } = retrievalRecord

    try {
      // 1. Submit an empty order
      const emptyOrderResponse = await request.post({
        uri: `${getEarthdataConfig('sit').echoRestRoot}/orders.json`,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId('sit').background
        },
        body: { order: {} },
        json: true,
        resolveWithFullResponse: true
      })

      const { order } = emptyOrderResponse.body
      const { id: orderId } = order

      // 2. Add items to the orders
      const orderItemPayload = await constructOrderPayload(
        accessMethod, granuleParams, accessTokenWithClient
      )

      await request.post({
        uri: `${getEarthdataConfig('sit').echoRestRoot}/orders/${orderId}/order_items/bulk_action`,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId('sit').background
        },
        body: orderItemPayload,
        json: true,
        resolveWithFullResponse: true
      })

      // 3. Add contact information
      const userInformationPayload = await constructUserInformationPayload(echoProfile, ursProfile)

      await request.put({
        uri: `${getEarthdataConfig('sit').echoRestRoot}/orders/${orderId}/user_information`,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId('sit').background
        },
        body: userInformationPayload,
        json: true,
        resolveWithFullResponse: true
      })

      // 4. Submit the order
      await request.post({
        uri: `${getEarthdataConfig('sit').echoRestRoot}/orders/${orderId}/submit`,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId('sit').background
        },
        json: true,
        resolveWithFullResponse: true
      })

      await dbConnection('retrieval_orders').update({ order_number: orderId }).where({ id })

      // start the order status check workflow
      startOrderStatusUpdateWorkflow(orderId, accessTokenWithClient)
    } catch (e) {
      console.log(e)

      // Re-throw the error to utilize the dead letter queue
      throw e
    }
  })
}

export default submitLegacyServicesOrder
