import 'array-foreach-async'
import request from 'request-promise'

import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { constructOrderPayload } from './constructOrderPayload'
import { constructUserInformationPayload } from './constructUserInformationPayload'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/getEdlConfig'
import { parseError } from '../../../sharedUtils/parseError'
import { startOrderStatusUpdateWorkflow } from '../util/startOrderStatusUpdateWorkflow'

/**
 * Submits an order to Legacy Services (CMR)
 * @param {Object} event Queue messages from SQS
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const submitLegacyServicesOrder = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const { Records: sqsRecords = [] } = event

  if (sqsRecords.length === 0) return

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
        'retrieval_orders.granule_params',
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

    const { type } = accessMethod

    try {
      // 1. Submit an empty order
      const emptyOrderResponse = await request.post({
        uri: `${getEarthdataConfig(cmrEnv()).echoRestRoot}/orders.json`,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId().background
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

      console.log(`Order Items Payload: ${JSON.stringify(orderItemPayload, null, 4)}`)

      await request.post({
        uri: `${getEarthdataConfig(cmrEnv()).echoRestRoot}/orders/${orderId}/order_items/bulk_action`,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId().background
        },
        body: orderItemPayload,
        json: true,
        resolveWithFullResponse: true
      })

      // 3. Add contact information
      const userInformationPayload = await constructUserInformationPayload(echoProfile, ursProfile)

      console.log(`User Information Payload: ${JSON.stringify(userInformationPayload, null, 4)}`)

      await request.put({
        uri: `${getEarthdataConfig(cmrEnv()).echoRestRoot}/orders/${orderId}/user_information`,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId().background
        },
        body: userInformationPayload,
        json: true,
        resolveWithFullResponse: true
      })

      // 4. Submit the order
      await request.post({
        uri: `${getEarthdataConfig(cmrEnv()).echoRestRoot}/orders/${orderId}/submit`,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId().background
        },
        json: true,
        resolveWithFullResponse: true
      })

      await dbConnection('retrieval_orders').update({ order_number: orderId, state: 'initialized' }).where({ id })

      // Start the order status check workflow
      await startOrderStatusUpdateWorkflow(id, accessTokenWithClient, type)
    } catch (e) {
      const parsedErrorMessage = parseError(e, { asJSON: false })

      const [errorMessage] = parsedErrorMessage

      await dbConnection('retrieval_orders').update({
        state: 'create_failed'
      }).where({ id })

      // Re-throw the error so the state machine handles the error correctly
      throw Error(errorMessage)
    }
  })
}

export default submitLegacyServicesOrder
