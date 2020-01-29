import request from 'request-promise'
import { isWarmUp } from '../util/isWarmup'
import { getClientId, getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getJwtToken } from '../util/getJwtToken'
import { logHttpError } from '../util/logging/logHttpError'

/**
 * Perform an authenticated CMR Concept Metadata search
 * @param {Object} event Details about the HTTP request that it received
 */
const getProviders = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

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
    const errors = logHttpError(e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ errors })
    }
  }
}

export default getProviders
