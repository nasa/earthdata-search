import 'array-foreach-async'
import { parse as parseXml } from 'fast-xml-parser'
import request from 'request-promise'

import { cmrUrl } from '../util/cmr/cmrUrl'
import { getBoundingBox } from '../util/echoForms/getBoundingBox'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEdlConfig } from '../util/getEdlConfig'
import { getEmail } from '../util/echoForms/getEmail'
import { getEnvironmentConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { getNameValuePairsForProjections } from '../util/echoForms/getNameValuePairsForProjections'
import { getNameValuePairsForResample } from '../util/echoForms/getNameValuePairsForResample'
import { getShapefile } from '../util/echoForms/getShapefile'
import { getSubsetDataLayers } from '../util/echoForms/getSubsetDataLayers'
import { getSwitchFields } from '../util/echoForms/getSwitchFields'
import { getTopLevelFields } from '../util/echoForms/getTopLevelFields'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { parseError } from '../../../sharedUtils/parseError'
import { portalPath } from '../../../sharedUtils/portalPath'
import { prepareGranuleAccessParams } from '../../../sharedUtils/prepareGranuleAccessParams'
import { processPartialShapefile } from '../util/processPartialShapefile'
import { readCmrResults } from '../util/cmr/readCmrResults'
import { startOrderStatusUpdateWorkflow } from '../util/startOrderStatusUpdateWorkflow'

/**
 * Submits an order to Catalog Rest (ESI)
 * @param {Object} event Queue messages from SQS
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const submitCatalogRestOrder = async (event, context) => {
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
        'retrieval_orders.granule_params'
      )
      .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .where({
        'retrieval_orders.id': id
      })

    const {
      id: retrievalId,
      jsondata,
      user_id: userId,
      access_method: accessMethod,
      granule_params: granuleParams
    } = retrievalRecord

    const {
      portalId = getApplicationConfig().defaultPortal,
      shapefileId,
      selectedFeatures
    } = jsondata

    const preparedGranuleParams = prepareGranuleAccessParams(granuleParams)

    const granuleResponse = await request.get({
      uri: cmrUrl('search/granules.json', preparedGranuleParams),
      headers: {
        'Echo-Token': accessTokenWithClient,
        'Client-Id': getClientId().background
      },
      json: true,
      resolveWithFullResponse: true
    })

    const granuleResponseBody = readCmrResults('search/granules.json', granuleResponse)

    const { edscHost } = getEnvironmentConfig()

    const obfuscatedRetrievalId = obfuscateId(retrievalId)

    // URL used when submitting the order to inform the user where they can retrieve their order status
    const edscStatusUrl = `${edscHost}${portalPath({ portalId })}/downloads/${obfuscatedRetrievalId}`

    const { model, url, type } = accessMethod

    console.log('Submitted Model: ', model)

    let shapefileParam = {}

    if (shapefileId) {
      // Retrieve a shapefile if one was provided, and create a partial shapefile if the
      // user selected individual features from a file
      const shapefile = await processPartialShapefile(
        dbConnection,
        userId,
        shapefileId,
        selectedFeatures
      )

      shapefileParam = getShapefile(model, shapefile)
    }

    const orderPayload = {
      FILE_IDS: granuleResponseBody.map(granuleMetadata => granuleMetadata.title).join(','),
      CLIENT_STRING: `To view the status of your request, please see: ${edscStatusUrl}`,

      // Add echo forms keys to the order payload
      ...getTopLevelFields(model),
      ...getSwitchFields(model),
      ...getNameValuePairsForProjections(model),
      ...getNameValuePairsForResample(model),
      ...getSubsetDataLayers(model),
      ...getBoundingBox(model),
      ...getEmail(model),
      ...shapefileParam
    }

    // Remove any empty keys
    Object.keys(orderPayload)
      .forEach(key => (orderPayload[key] == null
        || orderPayload[key].length === 0) && delete orderPayload[key])

    try {
      const orderResponse = await request.post({
        uri: url,
        form: orderPayload,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId().background
        },
        resolveWithFullResponse: true
      })

      const orderResponseBody = parseXml(orderResponse.body, {
        ignoreAttributes: false,
        attributeNamePrefix: ''
      })

      const { 'eesi:agentResponse': agentResponse } = orderResponseBody
      const { order } = agentResponse
      const { orderId } = order

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

export default submitCatalogRestOrder
