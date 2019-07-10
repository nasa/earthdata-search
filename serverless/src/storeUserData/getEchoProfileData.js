import request from 'request-promise'
import {
  getEarthdataConfig,
  getSecretEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'

/**
 * Retrieve ECHO profile data for the provided username
 * @param {String} token A valid URS access token
 */
export const getEchoProfileData = async (token) => {
  let profileData = {}

  try {
    const { clientId } = getSecretEarthdataConfig('prod')

    const { echoRestRoot } = getEarthdataConfig('prod')

    const echoRestProfileUrl = `${echoRestRoot}/users/current.json`

    const echoRestProfileResponse = await request.get({
      uri: echoRestProfileUrl,
      headers: {
        'Client-Id': getClientId('prod').lamdbda,
        'Echo-Token': `${token}:${clientId}`
      },
      json: true,
      resolveWithFullResponse: true
    })

    const { body = {} } = echoRestProfileResponse

    profileData = body
  } catch (e) {
    console.log(e)
  }

  return profileData
}
