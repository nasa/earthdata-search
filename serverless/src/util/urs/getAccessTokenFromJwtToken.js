import { getDbConnection } from '../database/getDbConnection'
import { getVerifiedJwtToken } from '../getVerifiedJwtToken'

/**
 * Returns the decrypted urs system credentials from Secrets Manager
 */
export const getAccessTokenFromJwtToken = async (jwtToken) => {
  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const { id } = getVerifiedJwtToken(jwtToken)

  const existingUserTokens = await dbConnection('user_tokens')
    .first([
      'access_token',
      'refresh_token',
      'expires_at',
      'user_id'
    ])
    .where({ user_id: id })
    .orderBy('created_at', 'DESC')

  return existingUserTokens
}
