import request from 'request-promise'

import { cmrEnv } from '../../../../sharedUtils/cmrEnv'
import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { getEdlConfig } from '../getEdlConfig'
import { getUrsSystemCredentials } from './getUrsSystemCredentials'

// Initalize a variable to be set once
let cmrToken

/**
 * Returns a token from Legacy Services
 *  * @param {String} providedCmrEnv The CMR Environment to retrieve a token from
 */
export const getSystemToken = async (providedCmrEnv) => {
  if (cmrToken == null) {
    const cmrEnvironment = (providedCmrEnv || cmrEnv())

    const dbCredentials = await getUrsSystemCredentials()
    const { username: dbUsername, password: dbPassword } = dbCredentials

    // The client id is part of our Earthdata Login credentials
    const edlConfig = await getEdlConfig()
    const { client } = edlConfig
    const { id: clientId } = client

    const authenticationParams = {
      username: dbUsername,
      password: dbPassword,
      client_id: clientId,

      // TODO: Use the IP from the request
      user_ip_address: '127.0.0.1'
    }

    const authenticationUrl = `${getEarthdataConfig(cmrEnvironment).cmrHost}/legacy-services/rest/tokens.json`
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

    console.log(`Successfully retrieved a ${cmrEnvironment.toUpperCase()} token for '${username}'`)

    // The actual token is returned as `id`
    cmrToken = id
  }

  return cmrToken
}
