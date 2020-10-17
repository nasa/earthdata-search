import request from 'request-promise'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/getEdlConfig'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Retrieve ECHO profile data for the provided username
 * @param {String} token A valid URS access token
 */
export const getEchoProfileData = async (token, environment) => {
  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const { echoRestRoot } = getEarthdataConfig(environment)

  const echoRestProfileUrl = `${echoRestRoot}/users/current.json`

  const echoRestProfileResponse = await request.get({
    uri: echoRestProfileUrl,
    headers: {
      'Client-Id': getClientId().lambda,
      'Echo-Token': `${token}:${clientId}`
    },
    json: true,
    resolveWithFullResponse: true
  })

  const { body = {} } = echoRestProfileResponse

  return body
}
