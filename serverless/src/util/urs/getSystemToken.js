import request from 'request-promise'

import { getEdlConfig } from '../configUtil'
import { getEarthdataConfig, getClientId } from '../../../../sharedUtils/config'
import { getUrsSystemCredentials } from './getUrsSystemCredentials'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'

/**
 * Returns a token from URS
 */
export const getSystemToken = async (providedToken) => {
  if (providedToken) {
    return providedToken
  }

  const dbCredentials = await getUrsSystemCredentials(null)
  const { username: dbUsername, password: dbPassword } = dbCredentials

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const authenticationParams = {
    username: dbUsername,
    password: dbPassword,
    client_id: clientId,
    user_ip_address: '127.0.0.1'
  }

  const authenticationUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}/legacy-services/rest/tokens.json`
  const tokenResponse = await request.post({
    uri: authenticationUrl,
    body: {
      token: authenticationParams
    },
    json: true,
    resolveWithFullResponse: true,
    headers: {
      'Client-Id': getClientId().background
    }
  })

  const { body } = tokenResponse

  if (tokenResponse.statusCode !== 201) {
    // On error return whatever body is provided and let
    // the caller deal with it
    return body
  }

  const { token } = body
  const { id, username } = token

  console.log(`Successfully retrieved a token for '${username}'`)

  // The actual token is returned as `id`
  return id
}
