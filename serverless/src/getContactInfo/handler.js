import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'
import { parseError } from '../../../sharedUtils/parseError'
import { getCmrPreferencesData } from './getCmrPreferencesData'

/**
 * Handler for retrieving a users contact information
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

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const userRecord = await dbConnection('users')
      .first(
        'urs_id',
        'urs_profile'
      )
      .where({
        id
      })

    const {
      access_token: authToken
    } = await getAccessTokenFromJwtToken(jwtToken, earthdataEnvironment)

    // Make a request to CMR-ordering instead of the EDSC database
    const cmrPreferencesData = await getCmrPreferencesData(
      userRecord.urs_id,
      authToken,
      earthdataEnvironment
    )
    const { status, data: responseData } = cmrPreferencesData
    const { errors, data } = responseData

    if (errors) throw new Error(JSON.stringify(errors))

    const { user } = data

    const contactInfoData = {
      urs_profile: userRecord.urs_profile,
      cmr_preferences: user
    }

    return {
      isBase64Encoded: false,
      statusCode: status,
      headers: defaultResponseHeaders,
      body: JSON.stringify(contactInfoData)
    }
  } catch (error) {
    console.log({
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    })

    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default getContactInfo
