import axios from 'axios'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { getEdlConfig } from '../getEdlConfig'
import { getUrsSystemCredentials } from './getUrsSystemCredentials'

// Initalize a variable to be set once
let cmrToken

/**
 * Returns a token from Legacy Services
 * @param {String} earthdataEnvironment The Earthdata Environment to retrieve a token from
 */
export const getSystemToken = async () => {
  const earthdataEnvironment = deployedEnvironment()

  if (cmrToken == null) {
    const dbCredentials = await getUrsSystemCredentials(earthdataEnvironment)
    const {
      username: dbUsername,
      password: dbPassword
    } = dbCredentials

    // The client id is part of our Earthdata Login credentials
    const edlConfig = await getEdlConfig(earthdataEnvironment)
    const { client } = edlConfig
    const { id: clientId } = client

    const authenticationParams = {
      username: dbUsername,
      password: dbPassword,
      client_id: clientId,

      // TODO: Use the IP from the request
      user_ip_address: '127.0.0.1'
    }

    const authenticationUrl = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/legacy-services/rest/tokens.json`
    const tokenResponse = await axios({
      method: 'post',
      url: authenticationUrl,
      data: {
        token: authenticationParams
      },
      headers: {
        'Client-Id': getClientId().background
      }
    })

    const { data } = tokenResponse

    if (tokenResponse.status !== 201) {
      // On error return whatever data is provided and let
      // the caller deal with it
      return data
    }

    const { token } = data
    const { id, username } = token

    console.log(`Successfully retrieved a ${earthdataEnvironment.toUpperCase()} token for '${username}'`)

    // The actual token is returned as `id`
    cmrToken = id
  }

  return cmrToken
}
