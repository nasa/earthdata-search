import request from 'request-promise'
import {
  getEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { getEdlConfig } from '../configUtil'

/**
 * Retrieve ECHO profile data for the provided username
 * @param {String} token A valid URS access token
 */
export const getEchoProfileData = async (token) => {
  let profileData = {}

  try {
    // The client id is part of our Earthdata Login credentials
    const edlConfig = await getEdlConfig()
    const { client } = edlConfig
    const { id: clientId } = client

    const { echoRestRoot } = getEarthdataConfig('sit')

    const echoRestProfileUrl = `${echoRestRoot}/users/current.json`

    const echoRestProfileResponse = await request.get({
      uri: echoRestProfileUrl,
      headers: {
        'Client-Id': getClientId('sit').lambda,
        'Echo-Token': `${token}:${clientId}`
      },
      json: true,
      resolveWithFullResponse: true
    })

    const { body = {} } = echoRestProfileResponse

    profileData = body
  } catch (e) {
    console.log(e)
  }

  return profileData
}
