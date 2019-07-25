import 'array-foreach-async'
import AWS from 'aws-sdk'
import { parse as parseXml } from 'fast-xml-parser'
import request from 'request-promise'
import { getClientId, getEarthdataConfig, getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { cmrUrl } from '../util/cmr/cmrUrl'
import { readCmrResults } from '../util/cmr/readCmrResults'
import { getDbConnection } from '../util/database/getDbConnection'
import { getBoundingBox } from '../util/echoForms/getBoundingBox'
import { getNameValuePairsForProjections } from '../util/echoForms/getNameValuePairsForProjections'
import { getNameValuePairsForResample } from '../util/echoForms/getNameValuePairsForResample'
import { getSubsetDataLayers } from '../util/echoForms/getSubsetDataLayers'
import { getSwitchFields } from '../util/echoForms/getSwitchFields'
import { getTopLevelFields } from '../util/echoForms/getTopLevelFields'

// Knex database connection object
let dbConnection = null

let sqs

const submitCatalogRestOrder = async (event, context) => {
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
      granule_params: granuleParams,
      id,
      url
    } = JSON.parse(body)

    const ursClientId = getSecretEarthdataConfig('prod').clientId
    const accessTokenWithClient = `${accessToken}:${ursClientId}`

    const granuleResponse = await request.get({
      uri: cmrUrl('search/granules.json', granuleParams),
      headers: {
        'Echo-Token': accessTokenWithClient,
        'Client-Id': getClientId('prod').background
      },
      json: true,
      resolveWithFullResponse: true
    })

    const granuleResponseBody = readCmrResults('search/granules', granuleResponse)

    // Fetch the retrieval id that the order belongs to so that we can provide a link to the status page
    const retrievalRecord = await dbConnection('retrieval_orders')
      .first(
        'retrievals.id',
        'retrieval_collections.access_method'
      )
      .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .where({
        'retrieval_orders.id': id
      })

    const {
      id: retrievalId,
      access_method: accessMethod
    } = retrievalRecord

    // URL used when submitting the order to inform the user where they can retrieve their order status
    const edscStatusUrl = `${getEarthdataConfig('prod').edscHost}/data/retrieve/${retrievalId}`

    const { model } = accessMethod

    const orderPayload = {
      FILE_IDS: granuleResponseBody.map(granuleMetadata => granuleMetadata.title),
      CLIENT_STRING: `To view the status of your request, please see: ${edscStatusUrl}`,

      // Add echo forms keys to the order payload
      ...getTopLevelFields(model),
      ...getSwitchFields(model),
      ...getNameValuePairsForProjections(model),
      ...getNameValuePairsForResample(model),
      ...getSubsetDataLayers(model),
      ...getBoundingBox(model)
    }

    console.log('orderPayload', orderPayload)

    try {
      const orderResponse = await request.post({
        uri: url,
        form: orderPayload,
        headers: {
          'Echo-Token': accessTokenWithClient,
          'Client-Id': getClientId('prod').background
        },
        resolveWithFullResponse: true
      })

      console.log(orderResponse.body)

      const orderResponseBody = parseXml(orderResponse.body, {
        ignoreAttributes: false,
        attributeNamePrefix: ''
      })

      const { 'eesi:agentResponse': agentResponse } = orderResponseBody
      const { order } = agentResponse
      const { orderId } = order

      await dbConnection('retrieval_orders').update({ order_number: orderId }).where({ id })
    } catch (e) {
      console.log(e)

      // Re-throw the error to utilize the dead letter queue
      throw e
    }
  })
}

export default submitCatalogRestOrder
