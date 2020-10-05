import { getDbConnection } from '../util/database/getDbConnection'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Retrieve all the retrievals for the authenticated user
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const adminGetRetrieval = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { id: providedRetrieval } = event.pathParameters

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalResponse = await dbConnection('retrievals')
      .select('retrievals.id',
        'retrievals.jsondata',
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
        'retrieval_orders.type',
        'users.urs_id')
      .select(dbConnection.raw("retrieval_collections.collection_metadata -> 'title' as title"))
      .select(dbConnection.raw("retrieval_collections.collection_metadata -> 'data_center' as data_center"))
      .leftOuterJoin('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
      .leftOuterJoin('retrieval_orders', { 'retrieval_collections.id': 'retrieval_orders.retrieval_collection_id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrievals.id': deobfuscateId(providedRetrieval)
      })

    // Pull out the retrieval data from the first row (they will all be the same due to the join)
    const [retrievalObject] = retrievalResponse

    const {
      id,
      jsondata,
      user_id: userId,
      username
    } = retrievalObject

    const formattedResponse = {
      id,
      jsondata,
      obfuscated_id: obfuscateId(id),
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
        data_center: dataCenter,
        title,
        state,
        order_number: orderNumber,
        order_information: orderInformation,
        type
      } = row

      if (cid) {
        if (!Object.keys(retrievalCollections).includes(cid.toString())) {
          retrievalCollections[cid] = {
            id: cid,
            access_method: accessMethod,
            collection_id: collectionId,
            granule_count: granuleCount,
            data_center: dataCenter,
            title,
            orders: []
          }
        }

        if (oid) {
          retrievalCollections[cid].orders.push({
            id: oid,
            state,
            order_number: orderNumber,
            order_information: orderInformation,
            type
          })
        }
      }
    })

    formattedResponse.collections = Object.values(retrievalCollections)

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(formattedResponse)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default adminGetRetrieval
