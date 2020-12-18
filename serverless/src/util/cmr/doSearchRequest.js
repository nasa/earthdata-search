import axios from 'axios'
import lowercaseKeys from 'lowercase-keys'

import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEarthdataConfig, getApplicationConfig } from '../../../../sharedUtils/config'
import { getEchoToken } from '../urs/getEchoToken'
import { parseError } from '../../../../sharedUtils/parseError'
import { prepareExposeHeaders } from './prepareExposeHeaders'
import { wrapAxios } from '../wrapAxios'

const wrappedAxios = wrapAxios(axios)

/**
 * Performs a search request and returns the result body and the JWT
 * @param {String} jwtToken JWT returned from edlAuthorizer
 * @param {String} path The CMR path to perform the search against
 * @param {String} params The parameters to send to with the HTTP request
 * @param {String} requestId A generated request id that will be sent as a header with the HTTP request
 * @param {String} providedHeaders Any headers to send along with the HTTP request
 * @param {String} method The HTTP method to use when making the request
 */
export const doSearchRequest = async ({
  earthdataEnvironment,
  jwtToken,
  method = 'post',
  params,
  path,
  providedHeaders = {},
  requestId
}) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    // Headers we'll send with every request
    const requestHeaders = {
      'Client-Id': getClientId().lambda,
      ...providedHeaders
    }

    if (jwtToken) {
      // Support endpoints that have optional authentication
      const token = await getEchoToken(jwtToken, earthdataEnvironment)

      requestHeaders.Authorization = `Bearer ${token}`
    }

    if (requestId) {
      // If the request doesnt come from the application, this is unlikely to be provided
      requestHeaders['CMR-Request-Id'] = requestId
    }

    const requestParams = {
      url: `${getEarthdataConfig(earthdataEnvironment).cmrHost}${path}`,
      headers: requestHeaders
    }

    let response
    if (method === 'post') {
      requestParams.method = 'post'

      requestParams.data = params

      response = await wrappedAxios(requestParams)
    } else {
      requestParams.method = 'get'

      requestParams.params = params

      response = await wrappedAxios(requestParams)
    }

    const { config, data, headers } = response
    const { elapsedTime } = config
    const { 'cmr-took': cmrTook } = headers

    console.log(`Request ${requestId} completed external request in [reported: ${cmrTook} ms, observed: ${elapsedTime} ms]`)

    return {
      statusCode: response.status,
      headers: {
        ...lowercaseKeys(defaultResponseHeaders),
        'cmr-hits': headers['cmr-hits'],
        'cmr-took': headers['cmr-took'],
        'cmr-request-id': headers['cmr-request-id'],
        'access-control-allow-origin': headers['access-control-allow-origin'],
        'access-control-expose-headers': prepareExposeHeaders(headers),
        'jwt-token': jwtToken,
        'access-control-allow-headers': '*'
      },
      body: JSON.stringify(data)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}
