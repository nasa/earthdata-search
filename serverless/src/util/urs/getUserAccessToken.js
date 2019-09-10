import { getDbConnection } from '../database/getDbConnection'

// Knex database connection object
let dbConnection = null

/**
 * Returns the decrypted urs system credentials from Secrets Manager
 */
export const getUserAccessToken = async (id) => {
  // Retrieve a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  const existingUserTokens = await dbConnection('user_tokens')
    .first([
      'access_token',
      'refresh_token',
      'expires_at'
    ])
    .where({ user_id: id })
    .orderBy('created_at', 'DESC')

  console.log('existingUserTokens', existingUserTokens)

  return existingUserTokens
}
