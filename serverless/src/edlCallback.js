import jwt from 'jsonwebtoken'
import simpleOAuth2 from 'simple-oauth2'

import { getEarthdataConfig, getSecretEarthdataConfig } from '../../sharedUtils/config'
import { getEdlConfig } from './configUtil'

let edlConfig = null

/**
 * Handler for the EDL callback. Fetches an EDL token based on 'code' param supplied by EDL. Sets
 * a cookie containing a JWT containing the EDL token
 */
export default async function edlCallback(event, context, callback) {
  edlConfig = await getEdlConfig(edlConfig)

  const params = event.queryStringParameters
  const { code, state } = params

  const { apiHost, redirectUriPath } = getEarthdataConfig('prod')
  const redirectUri = `${apiHost}${redirectUriPath}`

  const oauth2 = simpleOAuth2.create(edlConfig)
  const tokenConfig = {
    code,
    redirect_uri: redirectUri
  }

  // Retrieve the Earthdata Login token
  const oauthToken = await oauth2.authorizationCode.getToken(tokenConfig)

  // Create a JWT token from the EDL token
  const { secret } = getSecretEarthdataConfig('prod')
  const jwtToken = jwt.sign({ token: oauth2.accessToken.create(oauthToken).token }, secret)

  // Set the JWT token to a cookie and redirect back to EDSC
  callback(null, {
    statusCode: 307,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Set-Cookie': `authToken=${jwtToken}`,
      Location: state
    }
  })
}
