import jwt from 'jsonwebtoken'
import simpleOAuth2 from 'simple-oauth2'
import { getEarthdataConfig, getSecretEarthdataConfig } from '../../sharedUtils/config'
import { getEdlConfig } from './configUtil'
import { invokeLambda } from './util/aws/invokeLambda'

let edlConfig = null

/**
 * Handler for the EDL callback. Fetches an EDL token based on 'code' param supplied by EDL. Sets
 * a cookie containing a JWT containing the EDL token
 */
export default async function edlCallback(event) {
  edlConfig = await getEdlConfig(edlConfig)

  const params = event.queryStringParameters
  const { code, state } = params

  const {
    apiHost,
    edscHost,
    redirectUriPath
  } = getEarthdataConfig('prod')
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
  const { access_token: accessToken, endpoint } = token
  const username = endpoint.split('/').pop()

  const { secret } = getSecretEarthdataConfig('prod')

  // Create a JWT token from the EDL token
  const jwtToken = jwt.sign({ token }, secret)

  try {
    const eventParams = {
      username,
      token: accessToken
    }

    // Invoke the Lambda to store the authenticated users' data in our database
    await invokeLambda('earthdata-search-lab-storeUserData', eventParams)
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
