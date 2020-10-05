import 'array-foreach-async'
import axios from 'axios'

import { constructOrderPayload } from './constructOrderPayload'
import { constructOrderUrl } from './constructOrderUrl'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEdlConfig } from '../util/getEdlConfig'
import { parseError } from '../../../sharedUtils/parseError'
import { processPartialShapefile } from '../util/processPartialShapefile'
import { startOrderStatusUpdateWorkflow } from '../util/startOrderStatusUpdateWorkflow'

/**
 * Submits an order to Harmony
 * @param {Object} event Queue messages from SQS
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const submitHarmonyOrder = async (event, context) => {
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
        'retrievals.jsondata',
        'retrievals.user_id',
        'retrieval_collections.access_method',
        'retrieval_collections.collection_id',
        'retrieval_orders.granule_params'
      )
      .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .where({
        'retrieval_orders.id': id
      })

    const {
      access_method: accessMethod,
      collection_id: collectionId,
      granule_params: granuleParams,
      jsondata,
      user_id: userId
    } = retrievalRecord

    const {
      type
    } = accessMethod

    const {
      shapefileId,
      selectedFeatures
    } = jsondata

    let shapefile

    if (shapefileId) {
      // Retrieve a shapefile if one was provided, and create a partial shapefile if the
      // user selected individual features from a file
      shapefile = await processPartialShapefile(
        dbConnection,
        userId,
        shapefileId,
        selectedFeatures
      )
    }

    try {
      const constructedHarmonyUrl = constructOrderUrl(collectionId, accessMethod)

      const orderPayload = await constructOrderPayload({
        accessMethod,
        granuleParams,
        accessTokenWithClient,
        shapefile
      })

      const orderResponse = await axios({
        method: 'post',
        url: constructedHarmonyUrl,
        data: orderPayload.stream, // Set internal stream as request body
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...orderPayload.headers // Set headers (Content-Type) of the current FormData instance include the Boundary
        },
        maxRedirects: 1
      })

      const { data } = orderResponse
      const { jobID: orderId, progress } = data

      await dbConnection('retrieval_orders').update({
        order_number: orderId,
        state: progress === 100 ? 'complete' : 'initialized',
        order_information: data
      }).where({ id })

      if (orderId) {
        // Start the order status check workflow
        await startOrderStatusUpdateWorkflow(id, accessToken, type)
      }
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

export default submitHarmonyOrder
