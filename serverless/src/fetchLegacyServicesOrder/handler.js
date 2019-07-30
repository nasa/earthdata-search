import AWS from 'aws-sdk'
import 'array-foreach-async'
import request from 'request-promise'
import { getDbConnection } from '../util/database/getDbConnection'
import { getSystemToken } from '../util/urs/getSystemToken'
import { getEarthdataConfig, getClientId, getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { normalizeLegacyServicesOrderStatus } from '../util/orderStatus'

// Knex database connection object
let dbConnection = null

let cmrToken

const fetchLegacyServicesOrder = async (input) => {
  dbConnection = await getDbConnection(dbConnection)
  cmrToken = await getSystemToken(cmrToken)

  // Destructure the payload from step function input
  const {
    accessToken,
    id
  } = JSON.parse(input)

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
  
  return {
    orderStatus: normalizeLegacyServicesOrderStatus(order)
  }
}

export default fetchLegacyServicesOrder
