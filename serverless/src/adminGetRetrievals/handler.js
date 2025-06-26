import { getDbConnection } from '../util/database/getDbConnection'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

const sortKeyMap = {
  '-created_at': ['retrievals.created_at', 'desc'],
  '+created_at': ['retrievals.created_at', 'asc'],
  '-username': ['users.urs_id', 'desc'],
  '+username': ['users.urs_id', 'asc']
}

/**
 * Retrieve all the retrievals for the authenticated user (optional filter on user_id)
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const adminGetRetrievals = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { queryStringParameters = {} } = event
    const {
      page_num: pageNum = 1,
      page_size: pageSize = 20,
      sort_key: sortKey = '-created_at',
      user_id: userId,
      retrieval_collection_id: retrievalCollectionId
    } = queryStringParameters || {}

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    let query = dbConnection('retrievals')
      .select(
        'retrievals.id',
        'retrievals.jsondata',
        'retrievals.environment',
        'retrievals.created_at',
        'users.id as user_id',
        'users.urs_id as username'
      )
      .select(dbConnection.raw('count(*) OVER() as total'))
      .join('users', { 'retrievals.user_id': 'users.id' })

    if (userId) {
      query = query.whereRaw('LOWER(users.urs_id) = LOWER(?)', [userId])
    }

    if (retrievalCollectionId) {
      query = query
        .leftJoin('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
        .where({ 'retrieval_collections.id': parseInt(retrievalCollectionId, 10) })
    }

    const retrievalResponse = await query
      .orderBy(...sortKeyMap[sortKey])
      .limit(pageSize)
      .offset((pageNum - 1) * pageSize)

    if (retrievalResponse.length === 0) {
      const pagination = {
        page_num: parseInt(pageNum, 10),
        page_size: parseInt(pageSize, 10),
        page_count: 0,
        total_results: 0
      }

      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify({
          pagination,
          results: []
        })
      }
    }

    const { total } = retrievalResponse[0]

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
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default adminGetRetrievals
