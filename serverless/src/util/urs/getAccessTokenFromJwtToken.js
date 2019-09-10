import { getDbConnection } from '../database/getDbConnection'
import { getVerifiedJwtToken } from '../getVerifiedJwtToken'

// Knex database connection object
let dbConnection = null

/**
 * Returns the decrypted urs system credentials from Secrets Manager
 */
export const getAccessTokenFromJwtToken = async (jwtToken) => {
  // Retrieve a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  const { id } = getVerifiedJwtToken(jwtToken)

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
