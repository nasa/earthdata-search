import jwt from 'jsonwebtoken'
import simpleOAuth2 from 'simple-oauth2'
import { getEdlConfig } from '../util/configUtil'
import { getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'

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
  authResponse.context = { jwtToken }

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
 * API Gateway Authorizer to verify requets are authenticated
 */
const edlAuthorizer = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const edlConfig = await getEdlConfig()

  if (!event.authorizationToken) {
    throw new Error('Unauthorized')
  }

  // event.authorizationToken comes in as `Bearer: asdf.qwer.hjkl` but we only need the actual token
  const tokenParts = event.authorizationToken.split(' ')
  let jwtToken = tokenParts[1]

  try {
    // Pull the secret used to encrypt our jwtTokens
    const { secret } = getSecretEarthdataConfig(cmrEnv())

    return jwt.verify(jwtToken, secret, async (verifyError, decoded) => {
      if (verifyError) {
        // 401 Unauthorized
        console.log(`Token invalid. ${verifyError}`)
        throw new Error('Unauthorized')
      }

      const oauth2 = simpleOAuth2.create(edlConfig)
      const oauthToken = oauth2.accessToken.create(decoded.token)
      if (oauthToken.expired()) {
        try {
          const refreshed = await oauthToken.refresh()
          console.log('Token refreshed successfully')
          jwtToken = jwt.sign({ token: refreshed.token }, secret)
        } catch (error) {
          console.log('Error refreshing access token: ', error.message)
          throw new Error('Unauthorized')
        }
      }

      const { token } = decoded
      const { endpoint } = token
      const username = endpoint.split('/').pop()

      return generatePolicy(username, jwtToken, 'Allow', event.methodArn)
    })
  } catch (err) {
    console.log('Authorizer error. Invalid token', err)

    throw new Error('Unauthorized')
  }
}

export default edlAuthorizer
