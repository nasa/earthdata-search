import { getDbConnection } from '../util/database/getDbConnection'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

// const sortKeyMap = {
//   '-created_at': ['retrievals.created_at', 'desc'],
//   '+created_at': ['retrievals.created_at', 'asc'],
//   '-username': ['users.urs_id', 'desc'],
//   '+username': ['users.urs_id', 'asc']
// }

/**
 * Retrieve all the retrieval metrics for the authenticated user
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const adminGetRetrievalsMetrics = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false
  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { queryStringParameters = {} } = event
    // todo set page size somehow
    const {
      page_num: pageNum = 1,
      page_size: pageSize = 20,
      sort_key: sortKey = '-created_at'
    } = queryStringParameters || {}

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    // `jsonExtract` parses fields in `jsonb` columns
    // https://knexjs.org/guide/query-builder.html#jsonextract
    const retrievalResponse = await dbConnection('retrieval_collections')
      .jsonExtract('access_method', '$.type', 'access_method_type')
      .count('* as total_times_access_method_used')
      .select(dbConnection.raw('ROUND(AVG(retrieval_collections.granule_count)) AS average_granule_count'))
      .select(dbConnection.raw('ROUND(AVG(retrieval_collections.granule_link_count)) AS average_granule_link_count'))
      .select(dbConnection.raw('SUM(retrieval_collections.granule_count) AS total_granules_retrieved'))
      .select(dbConnection.raw('MAX(retrieval_collections.granule_link_count) AS max_granule_link_count'))
      .select(dbConnection.raw('MIN(retrieval_collections.granule_link_count) AS min_granule_link_count'))
      .groupBy('access_method_type')
      .orderBy('total_times_access_method_used')

    console.log('🚀 ~ file: handler.js:85 ~ adminGetRetrievalsMetrics ~ retrievalResponse:', retrievalResponse)
    const [firstResponseRow] = retrievalResponse

    const { total } = firstResponseRow

    const pagination = {
      page_num: parseInt(pageNum, 10),
      page_size: parseInt(pageSize, 10),
      page_count: Math.ceil(total / pageSize),
      total_results: parseInt(total, 10)
    }

    const results = retrievalResponse.map((retrieval) => ({
      ...retrieval,
      obfuscated_id: obfuscateId(retrieval.id)
    }))

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        pagination,
        results
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
