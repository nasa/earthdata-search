import { getUrsUserData } from './getUrsUserData'
import { getEchoProfileData } from './getEchoProfileData'
import { getEchoPreferencesData } from './getEchoPreferencesData'
import { getDbConnection } from '../util/database/getDbConnection'

// Knex database connection object
let dbConnection = null

export const storeUserData = async (event) => {
  const { username, token } = event

  // Retrieve a connection to the database
  dbConnection = await getDbConnection(dbConnection)

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
    environment: 'sit',
    urs_id: username,
    urs_profile: ursUserData
  }

  const existingUser = await dbConnection('users').select('id').where({ urs_id: username })

  let queryResponse

  if (existingUser.length) {
    queryResponse = await dbConnection('users').returning(['id', 'urs_id']).update({ ...userPayload }).where({ urs_id: username })
  } else {
    queryResponse = await dbConnection('users').returning(['id', 'urs_id']).insert({ ...userPayload })
  }

  return queryResponse
}

export default storeUserData
