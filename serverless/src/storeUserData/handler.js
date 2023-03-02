import 'array-foreach-async'

import { getDbConnection } from '../util/database/getDbConnection'
import { getCmrPreferencesData } from './getCmrPreferencesData'
import { getUrsUserData } from './getUrsUserData'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Accepts a username and token to fetch profile information from URS and CMR-ordering
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const storeUserData = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const { Records: sqsRecords = [] } = event

  if (sqsRecords.length === 0) return

  console.log(`Processing ${sqsRecords.length} user(s)`)

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

    console.log(`[StoreUserData Debug] Payload received: ${body}`)

    // Destruct the payload from SQS
    const {
      environment, userId, username
    } = JSON.parse(body)

    console.log(`[StoreUserData Debug] Attempting to retrieve user data for ${username} (id: ${userId}, environment: ${environment}).`)

    // Retrieve the authenticated users' access tokens from the database
    const existingUserTokens = await dbConnection('user_tokens')
      .select([
        'id',
        'access_token',
        'refresh_token',
        'expires_at'
      ])
      .where({ user_id: userId, environment })
      .orderBy('created_at', 'DESC')

    let ursUserData // URS user Profile
    let cmrPreferences // CMR-ordering user preferences

    if (existingUserTokens.length > 0) {
      const [tokenRow] = existingUserTokens
      const { access_token: token } = tokenRow

      // Default the payload that gets sent to the database
      const userPayload = {
        environment,
        urs_id: username
      }

      try {
        ursUserData = await getUrsUserData(username, token, environment)

        // If we successfully retrieved URS data add the response to the database payload
        userPayload.urs_profile = ursUserData
      } catch (e) {
        parseError(e, { logPrefix: '[StoreUserData Error] (URS Profile)' })
      }

      try {
        cmrPreferences = await getCmrPreferencesData(username, token, environment)
        // Add CMR-ordering response to the database payload if non-null
        if (cmrPreferences != null) {
          userPayload.cmr_preferences = cmrPreferences
        }
      } catch (e) {
        parseError(e, { logPrefix: '[StoreUserData Error] (CMR-ordering)' })
      }

      const dbResponse = await dbConnection('users').update({ ...userPayload }).where({ id: userId })

      console.log(`Response from updating ${username} (id: ${userId}): ${dbResponse}`)
    } else {
      console.log(`[StoreUserData Debug] Ignoring attempt to retrieve user data for ${username} (userId: ${userId}, environment: ${environment}) because the user doesn't have any available tokens.`)
    }
  })
}

export default storeUserData
