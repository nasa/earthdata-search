import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'

/**
 * Retrieve all the retrievals for the authenticated user
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
export default async function adminGetRetrievals(event, context) {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  try {
    const { id: providedRetrieval } = event.pathParameters

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalResponse = await dbConnection('retrievals')
      .select('jsondata',
        'retrievals.id',
        'users.id as user_id',
        'users.urs_id as username',
        'retrieval_collections.id as cid',
        'retrieval_collections.access_method',
        'retrieval_collections.collection_id',
        'retrieval_collections.granule_count',
        'retrieval_orders.id as oid',
        'retrieval_orders.state',
        'retrieval_orders.order_number',
        'retrieval_orders.order_information',
        'users.urs_id')
      .join('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
      .join('retrieval_orders', { 'retrieval_collections.id': 'retrieval_orders.retrieval_collection_id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrievals.id': providedRetrieval
      })

    // Pull out the retrieval data from the first row (they will all be the same due to the join)
    const [retrievalObject] = retrievalResponse

    const {
      id,
      user_id: userId,
      username
    } = retrievalObject

    const formattedResponse = {
      id,
      user_id: userId,
      username,
      collections: []
    }

    const retrievalCollections = {}

    retrievalResponse.forEach((row) => {
      const {
        cid,
        oid,
        access_method: accessMethod,
        collection_id: collectionId,
        granule_count: granuleCount,
        state,
        order_number: orderNumber,
        order_information: orderInformation
      } = row

      if (!Object.keys(retrievalCollections).includes(cid.toString())) {
        retrievalCollections[cid] = {
          id: cid,
          access_method: accessMethod,
          collection_id: collectionId,
          granule_count: granuleCount,
          orders: []
        }
      }
      retrievalCollections[cid].orders.push({
        id: oid,
        state,
        order_number: orderNumber,
        order_information: orderInformation
      })
    })

    formattedResponse.collections = Object.values(retrievalCollections)

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(formattedResponse)
    }
  } catch (e) {
    console.log(e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [e] })
    }
  }
}
