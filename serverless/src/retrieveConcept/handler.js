import request from 'request-promise'
import { getJwtToken } from '../util/getJwtToken'
import { cmrStringify } from '../util/cmr/cmrStringify'
import { pick } from '../util/pick'
import { getEarthdataConfig, getClientId, getApplicationConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { prepareExposeHeaders } from '../util/cmr/prepareExposeHeaders'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Perform an authenticated CMR concept search
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const retrieveConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { headers, queryStringParameters } = event

  // The 'Accept' header contains the UMM version
  const providedHeaders = pick(headers, ['Accept'])

  const permittedCmrKeys = ['pretty']

  const obj = pick(queryStringParameters, permittedCmrKeys)
  const queryParams = cmrStringify(obj)

  const jwtToken = getJwtToken(event)
  const path = `/search/concepts/${event.pathParameters.id}?${queryParams}`

  try {
    const response = await request.get({
      uri: `${getEarthdataConfig(cmrEnv()).cmrHost}${path}`,
      json: true,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': await getEchoToken(jwtToken),
        ...providedHeaders
      }
    })

    const { body, headers } = response

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
    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default retrieveConcept
