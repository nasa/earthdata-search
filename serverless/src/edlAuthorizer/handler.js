import jwt from 'jsonwebtoken'
import simpleOAuth2 from 'simple-oauth2'
import { getEdlConfig } from '../util/configUtil'
import { getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'
import { getDbConnection } from '../util/database/getDbConnection'

/**
 * Generate AuthPolicy for the Authorizer, and attach the JWT
 * @param {String} username username of authenticated uset
 * @param {Object} jwtToken JWT containing EDL token
 * @param {String} effect
 * @param {Object} resource
 */
const generatePolicy = (username, jwtToken, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = username

  if (jwtToken) {
    authResponse.context = { jwtToken }
  }

  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne

    authResponse.policyDocument = policyDocument
  }

  return authResponse
}

/**
 * Custom authorizer for API Gateway authentication
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlAuthorizer = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const edlConfig = await getEdlConfig()

  const { methodArn, requestContext = {} } = event
  const { resourcePath } = requestContext

  if (!event.authorizationToken) {
    const authOptionalPaths = [
      '/cwic/granules'
    ]

    // Allow for optional authentication
    if (authOptionalPaths.includes(resourcePath)) {
      return generatePolicy('anonymous', undefined, 'Allow', methodArn)
    }

    throw new Error('Unauthorized')
  }

  // event.authorizationToken comes in as `Bearer: asdf.qwer.hjkl` but we only need the actual token
  const tokenParts = event.authorizationToken.split(' ')
  const jwtToken = tokenParts[1]

  try {
    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    // Pull the secret used to encrypt our jwtTokens
    const { secret } = getSecretEarthdataConfig(cmrEnv())

    const cmrEnvironment = cmrEnv()

    return jwt.verify(jwtToken, secret, async (verifyError, decodedJwtToken) => {
      if (verifyError) {
        // This suggests that the token has been tampered with
        console.log(`JWT Token Invalid. ${verifyError}`)

        throw new Error('Unauthorized')
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
        .where({ user_id: userId, environment: cmrEnvironment })
        .orderBy('created_at', 'DESC')

      if (existingUserTokens.length === 0) {
        throw new Error('Unauthorized')
      }

      // In the off chance there are more than one, return the most recent token
      const [mostRecentToken] = existingUserTokens

      const {
        id: tokenId,
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
          // Remove the expired token
          await dbConnection('user_tokens')
            .where({ id: tokenId, environment: cmrEnvironment })
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
            environment: cmrEnvironment
          })
        } catch (error) {
          console.log('Error refreshing access token: ', error.message)

          throw new Error('Unauthorized')
        }
      }

      return generatePolicy(username, jwtToken, 'Allow', event.methodArn)
    })
  } catch (err) {
    console.log('Authorizer error. Invalid token', err)

    throw new Error('Unauthorized')
  }
}

export default edlAuthorizer
