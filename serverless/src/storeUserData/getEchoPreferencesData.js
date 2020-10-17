import request from 'request-promise'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/getEdlConfig'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Retrieve ECHO preferences data for the provided username
 * @param {String} username The ECHO username to lookup
 * @param {String} token A valid URS access token
 */
export const getEchoPreferencesData = async (username, token, environment) => {
  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const { echoRestRoot } = getEarthdataConfig(environment)

  const echoRestPreferencesUrl = `${echoRestRoot}/users/${username}/preferences.json`

  const echoRestPreferencesResponse = await request.get({
    uri: echoRestPreferencesUrl,
    headers: {
      'Client-Id': getClientId().lambda,
      'Echo-Token': `${token}:${clientId}`
    },
    json: true,
    resolveWithFullResponse: true
  })

  const { body = {} } = echoRestPreferencesResponse

  return body
}
