import { getDbConnection } from '../util/database/getDbConnection'
// import { obfuscateId } from '../util/obfuscation/obfuscateId'
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
    console.log('🚀 ~ file: handler.js:26 ~ adminGetRetrievalsMetrics ~ queryStringParameters:', queryStringParameters)
    const {
      // page_num: pageNum = 1,
      // page_size: pageSize = 20,
      // sort_key: sortKey = '-created_at'
      start_date: startDate,
      end_date: endDate
    } = queryStringParameters || {}

    // let filterStartDate
    // if (!startDate) {
    //   filterStartDate = '2009-01-01T00:00:00Z'
    // } else {
    //   filterStartDate = startDate
    // }

    // let filterEndDate
    // if (!endDate) {
    //   filterEndDate = '2029-01-01T00:00:00Z'
    // } else {
    //   filterEndDate = endDate
    // }

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

    // const [firstResponseRow] = retrievalResponse
    console.log('🚀 ~ file: handler.js:39 ~ adminGetRetrievalsMetrics ~ retrievalResponse:', retrievalResponse)
    // Get the list of retrievals which contain > 1 collection
    // todo be careful with the alias
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

    console.log('🥶 ~ file: handler.js:81 ~ adminGetRetrievalsMetrics ~ multCollectionResponse:', multCollectionResponse)

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
