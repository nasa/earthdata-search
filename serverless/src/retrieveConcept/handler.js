import axios from 'axios'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'
import { pick } from '../util/pick'
import { prepareExposeHeaders } from '../util/cmr/prepareExposeHeaders'
import { prepKeysForCmr } from '../../../sharedUtils/prepKeysForCmr'

/**
 * Perform an authenticated CMR concept search
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const retrieveConcept = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const {
    headers = {},
    pathParameters = {},
    queryStringParameters = {}
  } = event

  // The 'Accept' header contains the UMM version
  const providedHeaders = pick(headers, ['Accept'])

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const permittedCmrKeys = ['pretty']

  const obj = pick(queryStringParameters, permittedCmrKeys)

  const queryParams = prepKeysForCmr(obj)

  const jwtToken = getJwtToken(event)

  const { id } = pathParameters

  const path = `/search/concepts/${id}?${queryParams}`

  try {
    const response = await axios({
      method: 'get',
      url: `${getEarthdataConfig(earthdataEnvironment).cmrHost}${path}`,
      headers: {
        'Client-Id': getClientId().lambda,
        Authorization: `Bearer ${await getEchoToken(jwtToken, earthdataEnvironment)}`,
        ...providedHeaders
      }
    })

    const { data, headers } = response

    return {
      statusCode: response.status,
      headers: {
        'cmr-hits': headers['cmr-hits'],
        'cmr-took': headers['cmr-took'],
        'cmr-request-id': headers['cmr-request-id'],
        'access-control-allow-origin': headers['access-control-allow-origin'],
        'access-control-expose-headers': prepareExposeHeaders(headers),
        'jwt-token': jwtToken
      },
      body: JSON.stringify(data)
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
