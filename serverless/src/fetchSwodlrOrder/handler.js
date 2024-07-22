import 'array-foreach-async'
import axios from 'axios'

import { getDbConnection } from '../util/database/getDbConnection'
import { getStateFromOrderStatus } from '../../../sharedUtils/orderStatus'
import { parseError } from '../../../sharedUtils/parseError'

const parseSwodlrResponse = (data) => {
  const { status } = data
  const job = status[0]

  const {
    id: jobId,
    state,
    reason,
    product
  } = job

  const {
    timestamp,
    granules
  } = product

  return {
    jobId,
    status: state,
    updatedAt: timestamp,
    granules,
    reason
  }
}

const fetchSwodlrOrder = async (input) => {
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
        'retrieval_orders.order_information',
        'retrieval_orders.state',
        'retrieval_collections.access_method'
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

    const statusGraphqlQuery = `query GetStatusByProduct($product: ID!, $limit: Int) {
        status: statusByProduct(product: $product, limit: $limit) {
          id
          timestamp
          state
          reason
          product {
              id
              timestamp
              granules {
                id
                timestamp
                uri
              }
          }
        }
      }`

    const {
      order_information: orderInformation,
      access_method: accessMethod
    } = retrievalOrderRecord

    const { productId, createdAt } = orderInformation
    const { url } = accessMethod

    const swodlrUrl = `${url}/api/graphql`

    const variables = {
      product: productId
    }

    const orderResponse = await axios({
      url: swodlrUrl,
      method: 'post',
      data: {
        query: statusGraphqlQuery,
        variables
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    console.log('Order Response Body', JSON.stringify(orderResponse.data, null, 4))

    const parsedResponse = parseSwodlrResponse(orderResponse.data.data)

    const {
      jobId,
      status,
      updatedAt,
      granules,
      reason
    } = parsedResponse

    const prodStatus = getStateFromOrderStatus(status)

    // Updates the database with current order data
    await dbConnection('retrieval_orders')
      .update({
        order_information: {
          jobId,
          status: prodStatus,
          productId,
          reason,
          granules,
          createdAt,
          updatedAt
        },
        state: prodStatus,
        updated_at: updatedAt
      })
      .where({
        id
      })

    return {
      accessToken,
      id,
      orderStatus: prodStatus,
      orderType
    }
  } catch (error) {
    const parsedErrorMessage = parseError(error, { asJSON: false })

    const [errorMessage] = parsedErrorMessage

    // Re-throw the error so the state machine handles the error correctly
    throw Error(errorMessage)
  }
}

export default fetchSwodlrOrder
