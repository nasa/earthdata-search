import { keyBy } from 'lodash'
import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'
import { obfuscateId } from '../util/obfuscation/obfuscateId'

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
    const { queryStringParameters = {} } = event
    const {
      page_num: pageNum = 0,
      page_size: pageSize = 50
    } = queryStringParameters || {}

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalResponse = await dbConnection('retrievals')
      .select('jsondata',
        'retrievals.id',
        'retrievals.environment',
        'retrievals.created_at',
        'users.id as user_id',
        'users.urs_id as username')
      .join('users', { 'retrievals.user_id': 'users.id' })
      .orderBy('retrievals.created_at', 'DESC')
      .limit(pageSize)
      .offset(pageNum * pageSize)

    const groupedRetrievals = keyBy(retrievalResponse.map(retrieval => ({
      ...retrieval,
      obfuscated_id: obfuscateId(retrieval.id)
    })), 'obfuscated_id')

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(groupedRetrievals, 'created_at')
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
