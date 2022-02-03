import 'array-foreach-async'
import axios from 'axios'

import { getDbConnection } from '../util/database/getDbConnection'
import { getStateFromOrderStatus } from '../../../sharedUtils/orderStatus'
import { parseError } from '../../../sharedUtils/parseError'

const fetchHarmonyOrder = async (input) => {
  const dbConnection = await getDbConnection()

  // Destructure the payload from step function input
  const {
    accessToken,
    id,
    orderType
  } = input

  try {
    // Fetch the retrieval id that the order belongs to so that we can provide a link to the status page
    const retrievalOrderRecord = await dbConnection('retrieval_orders')
      .first(
        'retrieval_orders.order_information'
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
      order_information: orderInformation
    } = retrievalOrderRecord

    // When harmony orders are submitted we store the response immediately giving us access to
    // the payload in this job. Part of the response is a list of links, a link with rel equal
    // to 'self' is the order status endpoint -- we'll use that to request the status
    const { links } = orderInformation
    const selfLink = links.find((link) => link.rel === 'self')
    const { href: orderStatusUrl } = selfLink

    console.log(`Requesting order data from Harmony at ${orderStatusUrl}`)

    const orderResponse = await axios({
      method: 'get',
      url: orderStatusUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const { data } = orderResponse

    console.log('Order Response Body', JSON.stringify(data, null, 4))

    const { status } = data

    // Updates the database with current order data
    await dbConnection('retrieval_orders')
      .update({
        order_information: data,
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

export default fetchHarmonyOrder
