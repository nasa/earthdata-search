import fs from 'fs'
import jwt from 'jsonwebtoken'
import simpleOAuth2 from 'simple-oauth2'

const config = JSON.parse(fs.readFileSync('config.json'))

/**
 * Handler for the EDL callback. Fetches an EDL token based on 'code' param supplied by EDL. Sets
 * a cookie containing a JWT containing the EDL token
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 */
export default async function edlCallback(event, context, callback) {
  const params = event.queryStringParameters
  const { code, state } = params

  const oauth2 = simpleOAuth2.create(config.oauth)
  const tokenConfig = {
    code,
    redirect_uri: config.redirectUri
  }

  // Retrieve the Earthdata Login token
  const oauthToken = await oauth2.authorizationCode.getToken(tokenConfig)

  // Create a JWT token from the EDL token
  const jwtToken = jwt.sign({ token: oauth2.accessToken.create(oauthToken).token }, config.secret)

  // Set the JWT token to a cookie and redirect back to EDSC
  callback(null, {
    statusCode: 307,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Set-Cookie': `authToken=${jwtToken}`,
      Location: state
    }
  })
}
