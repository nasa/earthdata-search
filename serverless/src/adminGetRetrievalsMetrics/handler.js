import { getDbConnection } from '../util/database/getDbConnection'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Retrieve all the retrieval metrics for the authenticated user
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const adminGetRetrievalsMetrics = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  context.callbackWaitsForEmptyEventLoop = false
  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { queryStringParameters = {} } = event
    const {
      start_date: startDate,
      end_date: endDate
    } = queryStringParameters || {}

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    // `jsonExtract` parses fields in `jsonb` columns
    // https://knexjs.org/guide/query-builder.html#jsonextract
    // Fetch metrics on `retrieval_collections`
    const retrievalResponse = await dbConnection('retrieval_collections')
      .jsonExtract('access_method', '$.type', 'access_method_type')
      .count('* as total_times_access_method_used')
      .select(dbConnection.raw('ROUND(AVG(retrieval_collections.granule_count)) AS average_granule_count'))
      .select(dbConnection.raw('ROUND(AVG(retrieval_collections.granule_link_count)) AS average_granule_link_count'))
      .select(dbConnection.raw('SUM(retrieval_collections.granule_count) AS total_granules_retrieved'))
      .select(dbConnection.raw('MAX(retrieval_collections.granule_link_count) AS max_granule_link_count'))
      .select(dbConnection.raw('MIN(retrieval_collections.granule_link_count) AS min_granule_link_count'))
      .modify((queryBuilder) => {
        if (startDate) {
          queryBuilder.where('retrieval_collections.created_at', '>=', startDate)
        }
      })
      .modify((queryBuilder) => {
        if (endDate) {
          queryBuilder.where('retrieval_collections.created_at', '<', endDate)
        }
      })
      .groupBy('access_method_type')
      .orderBy('total_times_access_method_used')

    // Fetch the list of `retrievals` which contained > 1 collections
    const multCollectionResponse = await dbConnection('retrieval_collections')
      .select('retrieval_collections.retrieval_id as retrieval_id')
      .modify((queryBuilder) => {
        if (startDate) {
          queryBuilder.where('retrieval_collections.created_at', '>=', startDate)
        }
      })
      .modify((queryBuilder) => {
        if (endDate) {
          queryBuilder.where('retrieval_collections.created_at', '<', endDate)
        }
      })
      .count('*')
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .groupBy('retrieval_id')
      .havingRaw('COUNT(*) > ?', [1])

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        results: {
          retrievalResponse,
          multCollectionResponse
        }
      })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default adminGetRetrievalsMetrics
