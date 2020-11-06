import request from 'request-promise'

import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Retrieve ECHO profile data for the provided username
 * @param {String} accessToken A valid URS access accessToken
 */
export const getEchoProfileData = async (accessToken, environment) => {
  const { echoRestRoot } = getEarthdataConfig(environment)

  const echoRestProfileUrl = `${echoRestRoot}/users/current.json`

  const echoRestProfileResponse = await request.get({
    uri: echoRestProfileUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': getClientId().lambda
    },
    json: true,
    resolveWithFullResponse: true
  })

  const { body = {} } = echoRestProfileResponse

  return body
}
