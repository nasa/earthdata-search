import axios from 'axios'

import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'
import { getUrsSystemCredentials } from './getUrsSystemCredentials'

/**
 * Deletes a token from EDL
 * @param {String} earthdataEnvironment The Earthdata Environment to delete a token from
 */
export const deleteSystemToken = async (token) => {
  const earthdataEnvironment = deployedEnvironment()
  const { edlHost } = getEarthdataConfig(earthdataEnvironment)
  const ursSystemUserCredentials = await getUrsSystemCredentials(earthdataEnvironment)
  const {
    username,
    password
  } = ursSystemUserCredentials

  // Base 64 encode the credentials
  const credentials = Buffer.from(`${username}:${password}`).toString('base64')

  await axios({
    method: 'post',
    url: `${edlHost}/api/users/revoke_token?token=${token}`,
    headers: {
      Authorization: `Basic ${credentials}`
    }
  })
}
