import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Retrieve a single retrieval collection from the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getRetrievalCollection = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { headers, pathParameters } = event

    const earthdataEnvironment = determineEarthdataEnvironment(headers)

    const {
      id: providedRetrievalCollectionId
    } = pathParameters

    const jwtToken = getJwtToken(event)

    const { id: userId } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalCollectionResponse = await dbConnection('retrieval_collections')
      .select(
        'retrievals.id AS retrieval_id',
        'retrievals.jsondata',
        'retrievals.environment',
        'retrieval_collections.id',
        'retrieval_collections.access_method',
        'retrieval_collections.collection_id',
        'retrieval_collections.collection_metadata',
        'retrieval_collections.granule_params',
        'retrieval_collections.granule_count',
        'retrieval_orders.id AS retrieval_order_id',
        'retrieval_orders.type',
        'retrieval_orders.order_number',
        'retrieval_orders.order_information',
        'retrieval_orders.state',
        'retrieval_orders.error',
        'users.urs_id'
      )
      .leftJoin('retrieval_orders', { 'retrieval_collections.id': 'retrieval_orders.retrieval_collection_id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrieval_collections.id': providedRetrievalCollectionId,
        'users.id': userId
      })

    if (retrievalCollectionResponse !== null && retrievalCollectionResponse.length > 0) {
      // Pull out the retrieval data from the first row (they will all be the same due to the join)
      const [retrievalCollectionObject] = retrievalCollectionResponse

      const {
        id,
        retrieval_id: retrievalId,
        access_method: accessMethod,
        collection_id: collectionId,
        collection_metadata: collectionMetadata,
        granule_params: granuleParams,
        granule_count: granuleCount,
        retrieval_order_id: retrievalOrderId, // Used to check whether or not orders exist based on the left join
        urs_id: ursId
      } = retrievalCollectionObject

      let orders = []

      // We used a left join above because there won't me any matching rows for
      // downloadable order types but using the left join will return null values
      // for those orders, we can check that here by checking any of the values
      if (retrievalOrderId) {
        orders = retrievalCollectionResponse.map(({
          retrieval_order_id: id,
          type,
          order_number: orderNumber,
          order_information: orderInformation,
          state,
          error
        }) => ({
          id,
          type,
          order_number: orderNumber,
          order_information: orderInformation,
          state,
          error
        }))
      }

      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify({
          id,
          retrieval_id: obfuscateId(retrievalId),
          access_method: accessMethod,
          collection_id: collectionId,
          collection_metadata: collectionMetadata,
          granule_params: granuleParams,
          granule_count: granuleCount,
          orders,
          urs_id: ursId
        })
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ errors: [`Retrieval Collection '${providedRetrievalCollectionId}' not found.`] })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default getRetrievalCollection
