import axios from 'axios'

import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Retrieve ECHO profile data for the provided username
 * @param {String} accessToken A valid URS access accessToken
 */
export const getEchoProfileData = async (accessToken, environment) => {
  const { echoRestRoot } = getEarthdataConfig(environment)

  const echoRestProfileUrl = `${echoRestRoot}/users/current.json`

  const echoRestProfileResponse = await axios({
    method: 'get',
    url: echoRestProfileUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': getClientId().lambda
    }
  })

  const { data = {} } = echoRestProfileResponse

  return data
}
