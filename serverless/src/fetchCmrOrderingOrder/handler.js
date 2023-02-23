import 'array-foreach-async'

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { getClientId } from '../../../sharedUtils/getClientId'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getStateFromOrderStatus } from '../../../sharedUtils/orderStatus'
import { parseError } from '../../../sharedUtils/parseError'

const fetchCmrOrderingOrder = async (input) => {
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
        'retrieval_orders.order_number',
        'retrievals.environment'
      )
      .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
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
      environment,
      order_number: orderNumber
    } = retrievalOrderRecord

    // Build cmr-ordering payload
    const query = `
      query Order (
        $id: String!
      ) {
        order (
          id: $id
        ) {
          id
          state
          collectionConceptId
          providerId
          providerTrackingId
          notificationLevel
          createdAt
          updatedAt
          submittedAt
          closedDate
        }
      }
    `

    const variables = {
      id: orderNumber
    }

    const cmrOrderingUrl = `${getEarthdataConfig(environment).cmrHost}/ordering/api`

    const requestId = uuidv4()

    console.log(`Requesting order data from cmr-ordering with requestId ${requestId} for orderId ${orderNumber}`)

    const orderResponse = await axios({
      url: cmrOrderingUrl,
      method: 'post',
      data: {
        query,
        variables
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': getClientId().background,
        'X-Request-Id': requestId
      }
    })

    console.log('Order Response Body', JSON.stringify(orderResponse.data, null, 4))

    const { data: responseData } = orderResponse
    const { data, errors } = responseData
    console.log('🚀 ~ file: handler.js:100 ~ fetchCmrOrderingOrder ~ responseData:', responseData)

    if (errors) throw new Error(JSON.stringify(errors))

    const { order } = data
    const { state } = order

    // Updates the database with current order data
    await dbConnection('retrieval_orders')
      .update({
        order_information: order,
        state
      })
      .where({
        id
      })

    return {
      accessToken,
      id,
      orderStatus: getStateFromOrderStatus(state),
      orderType
    }
  } catch (e) {
    const parsedErrorMessage = parseError(e, { asJSON: false })

    const [errorMessage] = parsedErrorMessage

    // Re-throw the error so the state machine handles the error correctly
    throw Error(errorMessage)
  }
}

export default fetchCmrOrderingOrder
