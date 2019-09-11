import { getDbConnection } from '../database/getDbConnection'

/**
 * Returns the decrypted urs system credentials from Secrets Manager
 */
export const getUserAccessToken = async (id) => {
  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const existingUserTokens = await dbConnection('user_tokens')
    .first([
      'access_token',
      'refresh_token',
      'expires_at'
    ])
    .where({ user_id: id })
    .orderBy('created_at', 'DESC')

  return existingUserTokens
}
