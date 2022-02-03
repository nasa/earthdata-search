import jwt from 'jsonwebtoken'
import simpleOAuth2 from 'simple-oauth2'

import { getDbConnection } from '../database/getDbConnection'
import { getEdlConfig } from '../getEdlConfig'
import { getSecretEarthdataConfig } from '../../../../sharedUtils/config'
import { parseError } from '../../../../sharedUtils/parseError'

/**
 * Validates a users EDL token, attempts to refresh the token if needed
 * @param {String} jwtToken Authorization token from request
 * @returns {String} username associated with the valid EDL token
 */
export const validateToken = async (jwtToken, earthdataEnvironment) => {
  const decodedJwtToken = jwt.decode(jwtToken)

  if (!decodedJwtToken) {
    return false
  }

  const { earthdataEnvironment: decodedEarthdataEnvironment = '' } = decodedJwtToken

  const edlConfig = await getEdlConfig(earthdataEnvironment)

  try {
    // If the environment in the jwtToken doesn't match the environment provided in the header
    if (earthdataEnvironment.toLowerCase() !== decodedEarthdataEnvironment.toLowerCase()) {
      return false
    }

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    // Pull the secret used to encrypt our jwtTokens
    const { secret } = getSecretEarthdataConfig(earthdataEnvironment)

    return jwt.verify(jwtToken, secret, async (verifyError, decodedJwtToken) => {
      if (verifyError) {
        // This suggests that the token has been tampered with
        console.log(`JWT Token Invalid. ${verifyError}`)

        return false
      }

      const {
        id: userId,
        username
      } = decodedJwtToken

      // Retrieve the authenticated users' access tokens from the database
      const existingUserTokens = await dbConnection('user_tokens')
        .select([
          'id',
          'access_token',
          'refresh_token',
          'expires_at'
        ])
        .where({ user_id: userId, environment: earthdataEnvironment })
        .orderBy('created_at', 'DESC')

      if (existingUserTokens.length === 0) {
        return false
      }

      // In the off chance there are more than one, return the most recent token
      const [mostRecentToken] = existingUserTokens

      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt
      } = mostRecentToken

      const oauth2 = simpleOAuth2.create(edlConfig)

      const oauthToken = oauth2.accessToken.create({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt
      })

      if (oauthToken.expired()) {
        try {
          // Remove all tokens for this user in the current environment
          await dbConnection('user_tokens')
            .where({ user_id: userId, environment: earthdataEnvironment })
            .del()

          const refreshedToken = await oauthToken.refresh()

          console.log(`Access token refreshed successfully for ${username}`)

          const { token } = refreshedToken
          const {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt
          } = token

          await dbConnection('user_tokens').insert({
            user_id: userId,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt,
            environment: earthdataEnvironment
          })
        } catch (error) {
          console.log('Error refreshing access token: ', error.message)

          return false
        }
      }

      // If successful, return the username associated with the token
      return username
    })
  } catch (e) {
    parseError(e)

    return false
  }
}
