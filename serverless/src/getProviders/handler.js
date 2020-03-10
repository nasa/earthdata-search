import request from 'request-promise'
import { getClientId, getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../util/parseError'

/**
 * Perform an authenticated CMR Concept Metadata search
 * @param {Object} event Details about the HTTP request that it received
 */
const getProviders = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const jwtToken = getJwtToken(event)

  const accessToken = await getEchoToken(jwtToken)

  const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/legacy-services/rest/providers.json`

  try {
    const response = await request.get({
      uri: url,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': accessToken
      },
      json: true
    })

    const { body } = response

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(body)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default getProviders
