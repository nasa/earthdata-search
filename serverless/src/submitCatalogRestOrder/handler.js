import 'array-foreach-async'

import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { stringify } from 'qs'
import camelcaseKeys from 'camelcase-keys'

import { getBoundingBox } from '../util/echoForms/getBoundingBox'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEmail } from '../util/echoForms/getEmail'
import {
  getEnvironmentConfig,
  getApplicationConfig,
  getEarthdataConfig
} from '../../../sharedUtils/config'
import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
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
import { startOrderStatusUpdateWorkflow } from '../util/startOrderStatusUpdateWorkflow'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ''
})

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

    // Fetch the retrieval id that the order belongs to so that we can provide a link to the status page
    const retrievalRecord = await dbConnection('retrieval_orders')
      .first(
        'retrievals.id',
        'retrievals.environment',
        'retrievals.jsondata',
        'retrievals.user_id',
        'retrieval_collections.access_method',
        'retrieval_orders.granule_params',
        'retrieval_orders.state'
      )
      .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .where({
        'retrieval_orders.id': id
      })

    const {
      access_method: accessMethod,
      environment,
      granule_params: granuleParams,
      id: retrievalId,
      jsondata,
      state,
      user_id: userId
    } = retrievalRecord

    // If the order has been successfully sent to the provider, do not continue processing
    // This can happen when one order fails to submit so the whole job returns to the queue to submit again, before the job is sent to the dead letter queue.
    if (state !== 'creating' && state !== 'create_failed') {
      return
    }

    try {
      const {
        portalId = getApplicationConfig().defaultPortal,
        shapefileId,
        selectedFeatures
      } = jsondata

      const preparedGranuleParams = camelcaseKeys(prepareGranuleAccessParams(granuleParams))

      const { pageNum = 1, pageSize: limit } = preparedGranuleParams
      const offset = limit * (pageNum - 1)

      // Only retrieve the granule title from cmr-graphql
      const graphqlQuery = `
        query GetGranules ($params: GranulesInput) {
          granules (params: $params) {
            items {
              title
            }
          }
        }
      `

      const granuleResponse = await axios({
        url: `${getEarthdataConfig(environment).graphQlHost}/api`,
        data: {
          query: graphqlQuery,
          variables: {
            params: {
              ...preparedGranuleParams,
              pageNum: undefined,
              pageSize: undefined,
              echoCollectionId: undefined,
              collectionConceptId: preparedGranuleParams.echoCollectionId,
              limit,
              offset
            }
          },
          operationName: 'GetGranules'
        },
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': getClientId().background
        }
      })
      const { data: responseData } = granuleResponse
      const { data } = responseData
      const { granules } = data
      const { items: granulesItems } = granules

      const { edscHost } = getEnvironmentConfig()

      const obfuscatedRetrievalId = obfuscateId(retrievalId)

      const eeLink = environment === deployedEnvironment() ? '' : `?ee=${environment}`

      // URL used when submitting the order to inform the user where they can retrieve their order status
      const edscStatusUrl = `${edscHost}${portalPath({ portalId })}/downloads/${obfuscatedRetrievalId}${eeLink}`

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
        FILE_IDS: granulesItems.map((granuleMetadata) => granuleMetadata.title).join(','),
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
        .forEach((key) => (orderPayload[key] == null
          || orderPayload[key].length === 0) && delete orderPayload[key])

      const orderResponse = await axios({
        method: 'post',
        url,
        data: stringify(orderPayload, {
          indices: false,
          arrayFormat: 'brackets'
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': getClientId().background
        }
      })

      const orderResponseBody = xmlParser.parse(orderResponse.data)

      const { 'eesi:agentResponse': agentResponse } = orderResponseBody
      const { order } = agentResponse
      const { orderId } = order

      await dbConnection('retrieval_orders').update({ order_number: orderId, state: 'initialized' }).where({ id })

      // Start the order status check workflow
      await startOrderStatusUpdateWorkflow(id, accessToken, type)
    } catch (e) {
      let [errorMessage] = parseError(e, { asJSON: false })

      // If the current state is `creating` then we don't want to throw a timeout error in the UI because the
      // job will run a second time through the SQS queue
      if (state === 'creating' && errorMessage === 'Endpoint request timed out') {
        errorMessage += '. The order has been placed on a queue for resubmission.'
      }

      await dbConnection('retrieval_orders').update({
        state: 'create_failed',
        error: errorMessage
      }).where({ id })

      // Re-throw the error so the state machine handles the error correctly
      throw Error(errorMessage)
    }
  })
}

export default submitCatalogRestOrder
