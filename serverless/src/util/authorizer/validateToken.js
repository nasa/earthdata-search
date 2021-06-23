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
  console.log(`validateToken:earthdataEnvironment ${earthdataEnvironment}`)
  console.log(`validateToken:JwtToken ${decodedJwtToken}`)
  console.log('validateToken 1')
  if (!decodedJwtToken) {
    return false
  }

  const { earthdataEnvironment: decodedEarthdataEnvironment = '' } = decodedJwtToken
  console.log('validateToken 2')
  const edlConfig = await getEdlConfig(earthdataEnvironment)
  console.log('validateToken 3')
  try {
    // If the environment in the jwtToken doesn't match the environment provided in the header
    if (earthdataEnvironment.toLowerCase() !== decodedEarthdataEnvironment.toLowerCase()) {
      return false
    }
    console.log('validateToken 4')
    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()
    console.log('validateToken 5')
    // Pull the secret used to encrypt our jwtTokens
    const { secret } = getSecretEarthdataConfig(earthdataEnvironment)
    console.log('validateToken 6')
    return jwt.verify(jwtToken, secret, async (verifyError, decodedJwtToken) => {
      if (verifyError) {
        // This suggests that the token has been tampered with
        console.log(`JWT Token Invalid. ${verifyError}`)

        return false
      }
      console.log('validateToken 7')
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
      console.log('validateToken 8')

      // In the off chance there are more than one, return the most recent token
      const [mostRecentToken] = existingUserTokens

      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt
      } = mostRecentToken

      const oauth2 = simpleOAuth2.create(edlConfig)
      console.log('validateToken 9')
      const oauthToken = oauth2.accessToken.create({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt
      })
      console.log('validateToken 10')

      if (oauthToken.expired()) {
        try {
          console.log('Refreshing access token')
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
      console.log('validateToken 11')
      // If successful, return the username associated with the token
      return username
    })
  } catch (e) {
    parseError(e)

    return false
  }
}
