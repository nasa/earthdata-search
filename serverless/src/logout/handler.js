import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Logs a user out and removes their token from the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const logout = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { headers } = event

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const { defaultResponseHeaders } = getApplicationConfig()

  const jwtToken = getJwtToken(event)

  const { id: userId } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const affectedRows = await dbConnection('user_tokens')
      .where({ user_id: userId, environment: earthdataEnvironment })
      .del()

    if (affectedRows > 0) {
      return {
        isBase64Encoded: false,
        statusCode: 204,
        headers: {
          ...defaultResponseHeaders,
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
        },
        body: null
      }
    }

    // If no rows were affected the where clause returned no rows, return a 404
    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: {
        ...defaultResponseHeaders,
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      body: JSON.stringify({ errors: [`User token for user '${userId}' not found.`] })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: {
        ...defaultResponseHeaders,
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      ...parseError(e)
    }
  }
}

export default logout
