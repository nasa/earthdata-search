import request from 'request-promise'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/getEdlConfig'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Retrieve URS profile data for the provided username
 * @param {String} username The URS username to lookup
 * @param {String} token A valid URS access token
 */
export const getUrsUserData = async (username, token) => {
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const { edlHost } = getEarthdataConfig(cmrEnv())

  const ursProfileUrl = `${edlHost}/api/users/${username}?client_id=${clientId}`

  const ursProfileResponse = await request.get({
    uri: ursProfileUrl,
    headers: {
      'Client-Id': getClientId().lambda,
      Authorization: `Bearer ${token}`
    },
    json: true,
    resolveWithFullResponse: true
  })

  const { body = {} } = ursProfileResponse

  return body
}
