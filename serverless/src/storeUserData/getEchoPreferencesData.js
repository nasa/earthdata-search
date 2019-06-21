import request from 'request-promise'
import { getEarthdataConfig, getSecretEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Retrieve ECHO preferences data for the provided username
 * @param {String} username The ECHO username to lookup
 * @param {String} token A valid URS access token
 */
export const getEchoPreferencesData = async (username, token) => {
  let preferencesData = {}

  try {
    const { clientId } = getSecretEarthdataConfig('prod')

    const { echoRestRoot } = getEarthdataConfig('prod')

    const echoRestPreferencesUrl = `${echoRestRoot}/users/${username}/preferences.json`

    const echoRestPreferencesResponse = await request.get({
      uri: echoRestPreferencesUrl,
      headers: {
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
