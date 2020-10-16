import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Handler for retreiving a users contact information
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getContactInfo = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  const { headers } = event

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const jwtToken = getJwtToken(event, earthdataEnvironment)

  const { id } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const userRecord = await dbConnection('users')
      .first(
        'echo_preferences',
        'urs_profile'
      )
      .where({
        id
      })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(userRecord)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default getContactInfo
