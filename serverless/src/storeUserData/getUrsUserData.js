import axios from 'axios'

import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/getEdlConfig'

/**
 * Retrieve URS profile data for the provided username
 * @param {String} username The URS username to lookup
 * @param {String} token A valid URS access token
 */
export const getUrsUserData = async (username, token, environment) => {
  const edlConfig = await getEdlConfig(environment)
  const { client } = edlConfig
  const { id: clientId } = client

  const { edlHost } = getEarthdataConfig(environment)

  const ursProfileUrl = `${edlHost}/api/users/${username}?client_id=${clientId}`

  const ursProfileResponse = await axios({
    method: 'get',
    url: ursProfileUrl,
    headers: {
      'Client-Id': getClientId().lambda,
      Authorization: `Bearer ${token}`
    }
  })

  const { data = {} } = ursProfileResponse

  return data
}
