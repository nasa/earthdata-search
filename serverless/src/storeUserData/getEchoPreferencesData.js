import request from 'request-promise'
import {
  getEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { getEdlConfig } from '../configUtil'

/**
 * Retrieve ECHO preferences data for the provided username
 * @param {String} username The ECHO username to lookup
 * @param {String} token A valid URS access token
 */
export const getEchoPreferencesData = async (username, token) => {
  let preferencesData = {}

  try {
    // The client id is part of our Earthdata Login credentials
    const edlConfig = await getEdlConfig()
    const { client } = edlConfig
    const { id: clientId } = client

    const { echoRestRoot } = getEarthdataConfig('sit')

    const echoRestPreferencesUrl = `${echoRestRoot}/users/${username}/preferences.json`

    const echoRestPreferencesResponse = await request.get({
      uri: echoRestPreferencesUrl,
      headers: {
        'Client-Id': getClientId('sit').lambda,
        'Echo-Token': `${token}:${clientId}`
      },
      json: true,
      resolveWithFullResponse: true
    })

    const { body = {} } = echoRestPreferencesResponse

    preferencesData = body
  } catch (e) {
    console.log(e)
  }

  return preferencesData
}
