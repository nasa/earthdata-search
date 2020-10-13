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
 * Retrieve all the retrievals for the authenticated user
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
      sort_key: sortKey = '-created_at'
    } = queryStringParameters || {}

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalResponse = await dbConnection('retrievals')
      .select('retrievals.id',
        'retrievals.jsondata',
        'retrievals.environment',
        'retrievals.created_at',
        'users.id as user_id',
        'users.urs_id as username')
      .select(dbConnection.raw('count(*) OVER() as total'))
      .join('users', { 'retrievals.user_id': 'users.id' })
      .orderBy(...sortKeyMap[sortKey])
      .limit(pageSize)
      .offset((pageNum - 1) * pageSize)

    const [firstResponseRow] = retrievalResponse

    const { total } = firstResponseRow

    const pagination = {
      page_num: parseInt(pageNum, 10),
      page_size: parseInt(pageSize, 10),
      page_count: Math.ceil(total / pageSize),
      total_results: parseInt(total, 10)
    }

    const results = retrievalResponse.map(retrieval => ({
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

export default adminGetRetrievals
