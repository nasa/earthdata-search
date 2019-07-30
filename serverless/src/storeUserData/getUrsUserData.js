import request from 'request-promise'
import {
  getEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { getEdlConfig } from '../configUtil'

/**
 * Retrieve URS profile data for the provided username
 * @param {String} username The URS username to lookup
 * @param {String} token A valid URS access token
 */
export const getUrsUserData = async (username, token) => {
  let userData = {}

  try {
    const edlConfig = await getEdlConfig()
    const { client } = edlConfig
    const { id: clientId } = client

    const { edlHost } = getEarthdataConfig('prod')

    const ursProfileUrl = `${edlHost}/api/users/${username}?client_id=${clientId}`

    const ursProfileResponse = await request.get({
      uri: ursProfileUrl,
      headers: {
        'Client-Id': getClientId('prod').lambda,
        Authorization: `Bearer ${token}`
      },
      json: true,
      resolveWithFullResponse: true
    })

    const { body = {} } = ursProfileResponse

    userData = body
  } catch (e) {
    console.log(e)
  }

  return userData
}
