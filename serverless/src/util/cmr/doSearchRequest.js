import request from 'request-promise'
import { prepareExposeHeaders } from './prepareExposeHeaders'
import { getClientId, getEarthdataConfig, getApplicationConfig } from '../../../../sharedUtils/config'
import { getEchoToken } from '../urs/getEchoToken'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'
import { logHttpError } from '../logging/logHttpError'

/**
 * Performs a search request and returns the result body and the JWT
 * @param {string} jwtToken JWT returned from edlAuthorizer
 * @param {string} url URL for to perform search
 */
export const doSearchRequest = async ({
  jwtToken,
  path,
  params,
  requestId,
  providedHeaders = {}
}) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const response = await request.post({
      uri: `${getEarthdataConfig(cmrEnv()).cmrHost}${path}`,
      form: params,
      json: true,
      resolveWithFullResponse: true,
      time: true,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': await getEchoToken(jwtToken),
        'CMR-Request-Id': requestId,
        ...providedHeaders
      }
    })

    const { body, headers } = response
    const { 'cmr-took': cmrTook } = headers

    console.log(`Request ${requestId} completed external request in [reported: ${cmrTook} ms, observed: ${response.elapsedTime} ms]`)

    return {
      statusCode: response.statusCode,
      headers: {
        'cmr-hits': headers['cmr-hits'],
        'cmr-took': headers['cmr-took'],
        'cmr-request-id': headers['cmr-request-id'],
        'access-control-allow-origin': headers['access-control-allow-origin'],
        'access-control-expose-headers': prepareExposeHeaders(headers),
        'jwt-token': jwtToken
      },
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
