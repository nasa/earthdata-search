import axios from 'axios'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { getUrsSystemCredentials } from './getUrsSystemCredentials'

// Initalize a variable to be set once
let cmrToken

/**
 * Returns a token from EDL for the system user
 * @param {String} earthdataEnvironment The Earthdata Environment to retrieve a token from
 */
export const getSystemToken = async () => {
  const earthdataEnvironment = deployedEnvironment()

  if (cmrToken == null) {
    const { edlHost } = getEarthdataConfig(earthdataEnvironment)
    const ursSystemUserCredentials = await getUrsSystemCredentials(earthdataEnvironment)
    const {
      username,
      password
    } = ursSystemUserCredentials

    // Base 64 encode the credentials
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')

    const url = `${edlHost}/api/users/token`

    let ursResponse
    try {
      ursResponse = await axios({
        method: 'post',
        url,
        headers: {
          Authorization: `Basic ${credentials}`
        }
      })
    } catch (e) {
      console.log('error', e)
    }

    const { data } = ursResponse

    if (ursResponse.status !== 200) {
      // On error return whatever data is provided and let
      // the caller deal with it
      return data
    }

    const { access_token: accessToken } = data

    console.log(`Successfully retrieved a ${earthdataEnvironment.toUpperCase()} token for '${username}'`)

    // The actual token is returned as `accessToken`
    cmrToken = accessToken
  }

  return cmrToken
}
