import axios from 'axios'

import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Retrieve ECHO preferences data for the provided username
 * @param {String} username The ECHO username to lookup
 * @param {String} token A valid URS access token
 */
export const getEchoPreferencesData = async (username, token, environment) => {
  const { echoRestRoot } = getEarthdataConfig(environment)

  const echoRestPreferencesUrl = `${echoRestRoot}/users/${username}/preferences.json`

  const echoRestPreferencesResponse = await axios({
    method: 'get',
    url: echoRestPreferencesUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': getClientId().lambda
    }
  })

  const { data = {} } = echoRestPreferencesResponse

  return data
}
