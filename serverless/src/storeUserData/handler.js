import 'array-foreach-async'

import { getDbConnection } from '../util/database/getDbConnection'
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
      edlToken,
      environment,
      userId,
      username
    } = JSON.parse(body)

    console.log(`[StoreUserData Debug] Attempting to retrieve user data for ${username} (id: ${userId}, environment: ${environment}).`)

    let ursUserData // URS user Profile

    if (edlToken) {
      // Default the payload that gets sent to the database
      const userPayload = {
        environment,
        urs_id: username
      }

      try {
        ursUserData = await getUrsUserData(username, edlToken, environment)

        // If we successfully retrieved URS data add the response to the database payload
        userPayload.urs_profile = ursUserData
      } catch (error) {
        parseError(error, { logPrefix: '[StoreUserData Error] (URS Profile)' })
      }

      const dbResponse = await dbConnection('users').update({ ...userPayload }).where({ id: userId })

      console.log(`Response from updating ${username} (id: ${userId}): ${dbResponse}`)
    } else {
      console.log(`[StoreUserData Debug] Ignoring attempt to retrieve user data for ${username} (userId: ${userId}, environment: ${environment}) because the user doesn't have a token.`)
    }
  })
}

export default storeUserData
