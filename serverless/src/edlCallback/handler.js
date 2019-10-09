import jwt from 'jsonwebtoken'
import simpleOAuth2 from 'simple-oauth2'
import { getEarthdataConfig, getEnvironmentConfig, getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/configUtil'
import { invokeLambda } from '../util/aws/invokeLambda'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'
import { getDbConnection } from '../util/database/getDbConnection'
import { getUsernameFromToken } from '../util/getUsernameFromToken'

/**
 * Fetches an EDL token based on the 'code' param supplied by EDL. Sets a cookie containing a JWT containing the EDL token
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlCallback = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const edlConfig = await getEdlConfig()

  const { code, state } = event.queryStringParameters

  const { redirectUriPath } = getEarthdataConfig(cmrEnv())
  const { apiHost, edscHost } = getEnvironmentConfig()

  const redirectUri = `${apiHost}${redirectUriPath}`

  const oauth2 = simpleOAuth2.create(edlConfig)

  const tokenConfig = {
    code,
    redirect_uri: redirectUri
  }

  // Retrieve the Earthdata Login token
  const oauthToken = await oauth2.authorizationCode.getToken(tokenConfig)
  const oauthTokenResponse = oauth2.accessToken.create(oauthToken)

  const { token } = oauthTokenResponse

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt
  } = token

  const { secret } = getSecretEarthdataConfig(cmrEnv())

  const username = getUsernameFromToken(token)

  let jwtToken

  try {
    // Look for an existing user
    let userRow = await dbConnection('users').first('id').where({ urs_id: username, environment: cmrEnv() })

    // If there is no existing user, create one
    if (!userRow) {
      [userRow] = await dbConnection('users').returning(['id']).insert({
        environment: cmrEnv(),
        urs_id: username
      })
    }

    // Store a new token in the database for the user
    await dbConnection('user_tokens').insert({
      user_id: userRow.id,
      environment: cmrEnv(),
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    })

    // Create a JWT token from the EDL response
    jwtToken = jwt.sign({
      id: userRow.id,
      username
    }, secret)

    // Invoke the Lambda to store the authenticated users' data in our database
    await invokeLambda(process.env.storeUserLambda, {
      username,
      token: accessToken
    })
  } catch (e) {
    console.log(e)
  }

  // Set the JWT token to a cookie and redirect back to EDSC
  const location = `${edscHost}/auth_callback?jwt=${jwtToken}&redirect=${encodeURIComponent(state)}`

  return {
    statusCode: 307,
    headers: {
      Location: location
    }
  }
}

export default edlCallback
