import AWS from 'aws-sdk'
import 'array-foreach-async'
import request from 'request-promise'
import { parse as parseXml } from 'fast-xml-parser'
import { getDbConnection } from '../util/database/getDbConnection'
import { getSystemToken } from '../util/urs/getSystemToken'
import { getSecretEarthdataConfig, getClientId } from '../../../sharedUtils/config'
import { normalizeCatalogRestOrderStatus } from '../util/orderStatus'

// Knex database connection object
let dbConnection = null

let cmrToken

const fetchCatalogRestOrder = async (input) => {
  // Retrieve a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  cmrToken = await getSystemToken(cmrToken)

  // Destruct the payload from the step function input
  const {
    accessToken,
    id
  } = JSON.parse(input)

  const ursClientId = getSecretEarthdataConfig('prod').clientId
  const accessTokenWithClient = `${accessToken}:${ursClientId}`

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

  console.log('raw order response body:', orderResponse.body)

  const orderResponseBody = parseXml(orderResponse.body, {
    ignoreAttributes: false,
    attributeNamePrefix: ''
  })

  console.log('parsed response body:', orderResponseBody)

  const { 'eesi:agentResponse': agentResponse } = orderResponseBody
  const { order } = agentResponse

  // Updates the database with current order data
  await dbConnection('retrieval_orders')
    .update({
      order_information: order
    })
    .where({
      id
    })
  
  return {
    orderStatus: normalizeCatalogRestOrderStatus(order)
  }
}

export default fetchCatalogRestOrder
