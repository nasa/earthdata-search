import AWS from 'aws-sdk'

import 'array-foreach-async'
import request from 'request-promise'
// import { stringify } from 'qs'
import { parse as parseXml } from 'fast-xml-parser'
import { getDbConnection } from '../util/database/getDbConnection'
import { getSystemToken } from '../util/urs/getSystemToken'
import { getClientId } from '../../../sharedUtils/config'
import { getEdlConfig } from '../configUtil'
// import { getSingleGranule } from '../util/cmr/getSingleGranule'

// AWS SQS adapter
let sqs

// Knex database connection object
let dbConnection = null

let cmrToken

const fetchCatalogRestOrder = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  if (!sqs) {
    sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
  }

  // Retrieve a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  const { Records: sqsRecords = [] } = event

  console.log(`Processing ${sqsRecords.length} order(s)`)

  cmrToken = await getSystemToken(cmrToken)

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

    // Destruct the payload from SQS
    const {
      accessToken,
      id
    } = JSON.parse(body)

    // The client id is part of our Earthdata Login credentials
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
      access_method: accessMethod
    } = retrievalRecord

    const { url } = accessMethod

    const orderResponse = await request.get({
      uri: `${url}/${id}`,
      headers: {
        'Echo-Token': accessTokenWithClient,
        'Client-Id': getClientId('prod').background
      },
      resolveWithFullResponse: true
    })

    const orderResponseBody = parseXml(orderResponse.body, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const { order } = orderResponseBody

    // Updates the database with current order data
    await dbConnection('retrieval_orders')
      .update({
        order_information: order
      })
      .where({
        id
      })
  })
}

export default fetchCatalogRestOrder
