import { getUrsUserData } from './getUrsUserData'
import { getEchoProfileData } from './getEchoProfileData'
import { getEchoPreferencesData } from './getEchoPreferencesData'
import { getDbConnection } from '../util/database/getDbConnection'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'

/**
 * Accepts a username and token to fetch profile information from URS and ECHO
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const storeUserData = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { username, token } = event

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const ursUserData = await getUrsUserData(username, token)
  const echoProfileData = await getEchoProfileData(token)

  const { user } = echoProfileData
  const { id } = user

  // Retrieving the ECHO Profile determines the user based on the token but
  // the preferences endpoint requires the user id (guid)
  const echoPreferencesData = await getEchoPreferencesData(id, token)
  const { preferences } = echoPreferencesData

  const userPayload = {
    echo_id: id,
    echo_profile: user,
    echo_preferences: preferences,
    environment: cmrEnv(),
    urs_id: username,
    urs_profile: ursUserData
  }

  const existingUser = await dbConnection('users').select('id').where({ urs_id: username })

  if (existingUser.length) {
    await dbConnection('users').update({ ...userPayload }).where({ urs_id: username })
  } else {
    await dbConnection('users').insert({ ...userPayload })
  }

  return true
}

export default storeUserData
