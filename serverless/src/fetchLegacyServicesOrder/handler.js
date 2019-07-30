import AWS from 'aws-sdk'
import 'array-foreach-async'
import request from 'request-promise'
import { getDbConnection } from '../util/database/getDbConnection'
import { getSystemToken } from '../util/urs/getSystemToken'
import { getEarthdataConfig, getClientId, getSecretEarthdataConfig } from '../../../sharedUtils/config'

// AWS SQS adapter
let sqs

// Knex database connection object
let dbConnection = null

let cmrToken

const fetchLegacyServicesOrder = async (event, context) => {
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

    const ursClientId = getSecretEarthdataConfig('prod').clientId
    const accessTokenWithClient = `${accessToken}:${ursClientId}`

    // Retrieve the order from Legacy Services
    const orderResponse = await request.post({
      uri: `${getEarthdataConfig('prod').echoRestRoot}/orders.json`,
      headers: {
        'Echo-Token': accessTokenWithClient,
        'Client-Id': getClientId('prod').background
      },
      body: { id },
      json: true,
      resolveWithFullResponse: true
    })

    const { order } = orderResponse

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

export default fetchLegacyServicesOrder
