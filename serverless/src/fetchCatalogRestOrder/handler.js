import 'array-foreach-async'
import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { getDbConnection } from '../util/database/getDbConnection'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getStateFromOrderStatus } from '../../../sharedUtils/orderStatus'
import { parseError } from '../../../sharedUtils/parseError'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ''
})

const fetchCatalogRestOrder = async (input) => {
  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  // Destruct the payload from the step function input
  const {
    accessToken,
    id,
    orderType
  } = input

  try {
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

    const orderResponse = await axios({
      url: `${url}/${orderNumber}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': getClientId().background
      }
    })

    console.log('Order Response Body', orderResponse.data)

    const orderResponseBody = xmlParser.parse(orderResponse.data)

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
  } catch (e) {
    const parsedErrorMessage = parseError(e, { asJSON: false })

    const [errorMessage] = parsedErrorMessage

    // Re-throw the error so the state machine handles the error correctly
    throw Error(errorMessage)
  }
}

export default fetchCatalogRestOrder
