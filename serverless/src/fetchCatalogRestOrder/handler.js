import 'array-foreach-async'
import request from 'request-promise'
import { parse as parseXml } from 'fast-xml-parser'
import { getDbConnection } from '../util/database/getDbConnection'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getStateFromOrderStatus } from '../../../sharedUtils/orderStatus'

const fetchCatalogRestOrder = async (input) => {
  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  // Destruct the payload from the step function input
  const {
    accessToken,
    id,
    orderType
  } = input

  // Fetch the retrieval id that the order belongs to so that we can provide a link to the status page
  const retrievalOrderRecord = await dbConnection('retrieval_orders')
    .first(
      'retrieval_collections.access_method',
      'retrieval_orders.order_number'
    )
    .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
    .where({
      'retrieval_orders.id': id
    })

  // If there is not record in the database prevent taking any additional actions
  if (!retrievalOrderRecord) {
    return {
      accessToken,
      id,
      orderStatus: 'not_found',
      orderType
    }
  }

  const {
    access_method: accessMethod,
    order_number: orderNumber
  } = retrievalOrderRecord

  const { url } = accessMethod

  console.log(`Requesting order data from EGI at ${url}/${orderNumber}`)

  const orderResponse = await request.get({
    uri: `${url}/${orderNumber}`,
    headers: {
      'Echo-Token': accessToken,
      'Client-Id': getClientId().background
    },
    resolveWithFullResponse: true
  })

  console.log('Order Response Body', orderResponse.body)

  const orderResponseBody = parseXml(orderResponse.body, {
    ignoreAttributes: false,
    attributeNamePrefix: ''
  })

  console.log('Parsed Order Response Body', JSON.stringify(orderResponseBody, null, 4))

  const { 'eesi:agentResponse': order } = orderResponseBody

  const { requestStatus } = order
  const { status } = requestStatus

  // Updates the database with current order data
  await dbConnection('retrieval_orders')
    .update({
      order_information: order,
      state: status
    })
    .where({
      id
    })

  return {
    accessToken,
    id,
    orderStatus: getStateFromOrderStatus(status),
    orderType
  }
}

export default fetchCatalogRestOrder
