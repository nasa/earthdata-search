import 'array-foreach-async'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { constructOrderPayload } from './constructOrderPayload'
import { getDbConnection } from '../util/database/getDbConnection'
import { parseError } from '../../../sharedUtils/parseError'
import { startOrderStatusUpdateWorkflow } from '../util/startOrderStatusUpdateWorkflow'

const graphQlQuery = `
mutation GenerateNewL2RasterProduct ($cycle: Int!, $pass: Int!, $scene: Int!, $outputGranuleExtentFlag: Boolean!, $outputSamplingGridType: GridType!, $rasterResolution: Int!, $utmZoneAdjust: Int, $mgrsBandAdjust: Int) { 
  generateL2RasterProduct(cycle: $cycle, pass: $pass, scene: $scene, outputGranuleExtentFlag: $outputGranuleExtentFlag, outputSamplingGridType: $outputSamplingGridType, rasterResolution: $rasterResolution, utmZoneAdjust: $utmZoneAdjust, mgrsBandAdjust: $mgrsBandAdjust) {
    cycle
    pass
    scene
    outputGranuleExtentFlag
    outputSamplingGridType
    rasterResolution
    utmZoneAdjust
    mgrsBandAdjust
    id
    timestamp
    status {
        id
        timestamp
        state
        reason
    }
  }
}`

/**
 * Submits an order to SWODLR
 * npm run invoke-local -- --function submitSwodlrOrder -p tmp/test_swodlr_order.json
 * @param {Object} event Queue messages from SQS
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const submitSwodlrOrder = async (event, context) => {
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
        collection_id: collectionConceptId,
        environment: earthdataEnvironment,
        granule_params: granuleParams
      } = retrievalRecord

      const { type, url: swodlrUrl } = accessMethod

      // No need for Accessmethod at this stage of dev.
      const granuleInfo = await constructOrderPayload({
        collectionConceptId,
        granuleParams,
        accessToken,
        earthdataEnvironment
      })

      const { orderItems } = granuleInfo

      await orderItems.forEachAsync(async (granule) => {
        const { granuleUr, granuleConceptId } = granule

        const splitTitle = granuleUr.split('_')
        const cycle = parseInt(splitTitle[10], 10)
        const pass = parseInt(splitTitle[11], 10)
        const scene = parseInt(splitTitle[12].substring(0, splitTitle[12].length - 1), 10)

        const { json_data: jsonData } = granuleParams
        const { params, custom_params: customParams } = jsonData

        const {
          outputGranuleExtentFlag,
          outputSamplingGridType,
          rasterResolution
        } = params

        const {
          utmZoneAdjust,
          mgrsBandAdjust
        } = customParams[granuleConceptId]

        const variables = {
          cycle,
          pass,
          scene,
          outputGranuleExtentFlag,
          outputSamplingGridType,
          rasterResolution,
          utmZoneAdjust,
          mgrsBandAdjust
        }

        const requestId = uuidv4()

        console.log(`Submitting retrieval_order ${id} to swodlr with requestId ${requestId}`)

        // Submit the order

        const response = await axios({
          url: `${swodlrUrl}/api/graphql`,
          method: 'post',
          data: {
            query: graphQlQuery,
            variables
          },
          headers: {
            authorization: `Bearer ${accessToken}`,
            'X-Request-Id': requestId
          }
        })

        const { data: responseData, errors } = response

        console.log(errors)

        if (errors) throw new Error(JSON.stringify(errors))

        const { data } = responseData
        const { generateL2RasterProduct } = data

        // ID Information
        // product Id is the Id of the product that's being generated
        // jobId is the Id of the job that is being run to generate the product
        const { id: productId, status: jobStatus } = generateL2RasterProduct
        const { id: jobId, state } = jobStatus[0]

        await dbConnection('retrieval_orders').update({
          order_number: productId,
          order_information: { jobId },
          state
        }).where({ id })
      })

      // Not sure if we can parse errors from swodlr

      // Start the order status check workflow
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

export default submitSwodlrOrder