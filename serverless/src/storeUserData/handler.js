import 'array-foreach-async'

import { isEmpty } from 'lodash'

import { getDbConnection } from '../util/database/getDbConnection'
import { getEchoPreferencesData } from './getEchoPreferencesData'
import { getEchoProfileData } from './getEchoProfileData'
import { getUrsUserData } from './getUrsUserData'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Accepts a username and token to fetch profile information from URS and ECHO
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

    let id // ECHO guid
    let user // ECHO User Profile
    let echoPreferencesData // ECHO Preferences Data
    let ursUserData // URS user Profile

    if (existingUserTokens.length > 0) {
      const [tokenRow] = existingUserTokens
      const { access_token: token } = tokenRow

      // Default the payload that gets sent to the database
      const userPayload = {
        echo_id: id,
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

      let echoProfileData = {}
      try {
        echoProfileData = await getEchoProfileData(token, environment)
      } catch (e) {
        parseError(e, { logPrefix: '[StoreUserData Error] (Echo Profile)' })
      }

      // Update the previously defined value for this variable
      ({ user = {} } = echoProfileData)

      if (!isEmpty(user)) {
        // If we successfully retrieved Echo Profile data add the response to the database payload
        userPayload.echo_profile = user;

        // The user GUID will be used to get the preference data as well as stored separately in the database
        ({ id } = user)

        try {
          echoPreferencesData = await getEchoPreferencesData(id, token, environment)

          userPayload.echo_preferences = echoPreferencesData
        } catch (e) {
          parseError(e, { logPrefix: '[StoreUserData Error] (Echo Preferences)' })
        }
      } else {
        console.log(`[StoreUserData Debug] Ignoring attempt to retrieve echo preferences data for ${username} (userId: ${userId}, environment: ${environment}) because the attempt to retrieve echo profile data failed.`)
      }

      const dbResponse = await dbConnection('users').update({ ...userPayload }).where({ id: userId })

      console.log(`Response from updating ${username} (id: ${userId}): ${dbResponse}`)
    } else {
      console.log(`[StoreUserData Debug] Ignoring attempt to retrieve user data for ${username} (userId: ${userId}, environment: ${environment}) because the user doesn't have any available tokens.`)
    }
  })
}

export default storeUserData
