import { AuthorizationCode } from 'simple-oauth2'
import { parse, stringify } from 'qs'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

import { createJwtToken } from '../util/createJwtToken'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEarthdataConfig, getEnvironmentConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/getEdlConfig'
import { getQueueUrl, QUEUE_NAMES } from '../util/getQueueUrl'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { getUsernameFromToken } from '../util/getUsernameFromToken'
import { parseError } from '../../../sharedUtils/parseError'

// AWS SQS adapter
let sqsClient

/**
 * Fetches an EDL token based on the 'code' param supplied by EDL. Sets a cookie containing a JWT containing the EDL token
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlCallback = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  if (sqsClient == null) {
    sqsClient = new SQSClient(getSqsConfig())
  }

  const { code, state } = event.queryStringParameters

  const [, queryString] = state.split('?')

  const params = parse(queryString)

  const { ee: earthdataEnvironment } = params

  const edlConfig = await getEdlConfig(earthdataEnvironment)

  const { redirectUriPath } = getEarthdataConfig(earthdataEnvironment)

  const { apiHost, edscHost } = getEnvironmentConfig()

  const redirectUri = `${apiHost}${redirectUriPath}`

  const client = new AuthorizationCode(edlConfig)

  const tokenConfig = {
    code,
    redirect_uri: redirectUri
  }

  let jwtToken
  let accessToken

  try {
    // Retrieve the Earthdata Login token
    const oauthToken = await client.getToken(tokenConfig)

    const { token } = oauthToken

    const {
      refresh_token: refreshToken,
      expires_at: expiresAt
    } = token;
    ({ access_token: accessToken } = token)

    const username = getUsernameFromToken(token)

    // Look for an existing user
    let userRow = await dbConnection('users').first([
      'id',
      'urs_id',
      'site_preferences',
      'urs_profile'
    ]).where({
      urs_id: username,
      environment: earthdataEnvironment
    })

    // If there is no existing user, create one
    if (!userRow) {
      [userRow] = await dbConnection('users').returning(['id', 'site_preferences']).insert({
        environment: earthdataEnvironment,
        urs_id: username
      })
    }

    // Store a new token in the database for the user
    await dbConnection('user_tokens').insert({
      user_id: userRow.id,
      environment: earthdataEnvironment,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    })

    // Create a JWT token from the EDL response
    jwtToken = createJwtToken(userRow, earthdataEnvironment)

    if (process.env.SKIP_SQS !== 'true') {
      const sqsCommand = new SendMessageCommand({
        QueueUrl: getQueueUrl(QUEUE_NAMES.UserDataQueue),
        MessageBody: JSON.stringify({
          environment: earthdataEnvironment,
          userId: userRow.id,
          username
        })
      })

      await sqsClient.send(sqsCommand)
    }
  } catch (error) {
    parseError(error)

    const queryParams = {
      ee: earthdataEnvironment,
      state
    }

    const location = `${apiHost}/login?${stringify(queryParams)}`

    return {
      statusCode: 307,
      headers: {
        Location: location
      }
    }
  }

  const queryParams = {
    redirect: state
  }

  if (jwtToken) {
    // Set the JWT token to a cookie and redirect back to EDSC
    queryParams.jwt = jwtToken
  }

  if (state.includes('earthdata-download')) {
    queryParams.accessToken = accessToken
  }

  const location = `${edscHost}/auth_callback?${stringify(queryParams)}`

  return {
    statusCode: 307,
    headers: {
      Location: location
    }
  }
}

export default edlCallback
