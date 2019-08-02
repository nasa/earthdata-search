import 'array-foreach-async'
import AWS from 'aws-sdk'
import { parse as parseXml } from 'fast-xml-parser'
import request from 'request-promise'

import { getClientId, getEarthdataConfig } from '../../../sharedUtils/config'
import { cmrUrl } from '../util/cmr/cmrUrl'
import { readCmrResults } from '../util/cmr/readCmrResults'
import { getDbConnection } from '../util/database/getDbConnection'
import { getBoundingBox } from '../util/echoForms/getBoundingBox'
import { getNameValuePairsForProjections } from '../util/echoForms/getNameValuePairsForProjections'
import { getNameValuePairsForResample } from '../util/echoForms/getNameValuePairsForResample'
import { getShapefile } from '../util/echoForms/getShapefile'
import { getSubsetDataLayers } from '../util/echoForms/getSubsetDataLayers'
import { getSwitchFields } from '../util/echoForms/getSwitchFields'
import { getTopLevelFields } from '../util/echoForms/getTopLevelFields'
import { getEdlConfig } from '../util/configUtil'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'

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
        'retrieval_collections.access_method',
        'retrieval_collections.granule_params'
      )
      .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .where({
        'retrieval_orders.id': id
      })

    const {
      id: retrievalId,
      jsondata,
      access_method: accessMethod,
      granule_params: granuleParams
    } = retrievalRecord

    const granuleResponse = await request.get({
      uri: cmrUrl('search/granules.json', granuleParams),
      headers: {
        'Echo-Token': accessTokenWithClient,
        'Client-Id': getClientId().background
      },
      json: true,
      resolveWithFullResponse: true
    })

    const granuleResponseBody = readCmrResults('search/granules', granuleResponse)

    // URL used when submitting the order to inform the user where they can retrieve their order status
    const edscStatusUrl = `${getEarthdataConfig(cmrEnv()).edscHost}/data/retrieve/${retrievalId}`

    const { model, url } = accessMethod

    // Retrieve the shapefile if one was provided
    const { shapefileId } = JSON.parse(jsondata)

    let shapefileParam
    if (shapefileId) {
      const shapefileRecord = await dbConnection('shapefiles')
        .first('file')
        .where({ id: shapefileId })
      const { file } = shapefileRecord

      shapefileParam = getShapefile(model, file)
    }

    const orderPayload = {
      FILE_IDS: granuleResponseBody.map(granuleMetadata => granuleMetadata.title),
      CLIENT_STRING: `To view the status of your request, please see: ${edscStatusUrl}`,

      // Add echo forms keys to the order payload
      ...getTopLevelFields(model),
      ...getSwitchFields(model),
      ...getNameValuePairsForProjections(model),
      ...getNameValuePairsForResample(model),
      ...getSubsetDataLayers(model),
      ...getBoundingBox(model),
      ...shapefileParam
    }

    // Remove any empty keys
    Object.keys(orderPayload)
      .forEach(key => (orderPayload[key].length === 0) && delete orderPayload[key])

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

      await dbConnection('retrieval_orders').update({ order_number: orderId }).where({ id })
    } catch (e) {
      console.log(e)

      // Re-throw the error to utilize the dead letter queue
      throw e
    }
  })
}

export default submitCatalogRestOrder
