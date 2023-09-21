import 'array-foreach-async'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { constructOrderPayload } from './constructOrderPayload'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'
import { startOrderStatusUpdateWorkflow } from '../util/startOrderStatusUpdateWorkflow'

/**
 * Submits an order to CMR Ordering (cmr-ordering)
 * npm run invoke-local -- --function submitCmrOrderingOrder -p tmp/test_echo_order.json
 * @param {Object} event Queue messages from SQS
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const submitCmrOrderingOrder = async (event, context) => {
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

    try {
      // Fetch the retrieval id that the order belongs to so that we can provide a link to the status page
      const retrievalRecord = await dbConnection('retrieval_orders')
        .first(
          'retrievals.id',
          'retrievals.environment',
          'retrieval_collections.collection_id',
          'retrieval_collections.access_method',
          'retrieval_orders.granule_params'
        )
        .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
        .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
        .where({
          'retrieval_orders.id': id
        })

      const {
        access_method: accessMethod,
        collection_id: collectionConceptId,
        environment: earthdataEnvironment,
        granule_params: granuleParams
      } = retrievalRecord

      // Build cmr-ordering payload
      const query = `
        mutation CreateOrder (
          $optionSelection: OptionSelectionInput!
          $orderItems: [OrderItemInput!]!
          $collectionConceptId: String!
          $providerId: String!
        ) {
          createOrder (
            optionSelection: $optionSelection
            orderItems: $orderItems
            collectionConceptId: $collectionConceptId
            providerId: $providerId
          ) {
            id
            state
          }
        }
      `
      const variables = await constructOrderPayload({
        collectionConceptId,
        accessMethod,
        granuleParams,
        accessToken,
        earthdataEnvironment
      })

      const cmrOrderingUrl = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/ordering/api`

      const requestId = uuidv4()

      console.log(`Submitting retrieval_order ${id} to cmr-ordering with requestId ${requestId}`)

      // Submit the order
      const response = await axios({
        url: cmrOrderingUrl,
        method: 'post',
        data: {
          query,
          variables
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': getClientId().background,
          'X-Request-Id': requestId
        }
      })

      const { data: responseData } = response

      const { data, errors } = responseData

      if (errors) throw new Error(JSON.stringify(errors))

      const { createOrder } = data
      const { id: orderId, state } = createOrder

      await dbConnection('retrieval_orders').update({
        order_number: orderId,
        state
      }).where({ id })

      // Start the order status check workflow
      const { type } = accessMethod
      await startOrderStatusUpdateWorkflow(id, accessToken, type)
    } catch (error) {
      const parsedErrorMessage = parseError(error, { asJSON: false })

      const [errorMessage] = parsedErrorMessage

      await dbConnection('retrieval_orders').update({
        state: 'create_failed',
        error: errorMessage
      }).where({ id })

      // Re-throw the error so the state machine handles the error correctly
      throw Error(errorMessage)
    }
  })
}

export default submitCmrOrderingOrder
