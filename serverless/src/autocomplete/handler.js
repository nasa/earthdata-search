import { buildParams } from '../util/cmr/buildParams'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Perform a search across all endpoints for autocompletion
 * @param {Object} event Details about the HTTP request that it received
 */
const autocomplete = async (event) => {
  const { body, headers } = event

  const { params, requestId } = JSON.parse(body)

  const { defaultResponseHeaders } = getApplicationConfig()

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const permittedCmrKeys = [
    'q',
    'type'
  ]

  const nonIndexedKeys = [
    'type'
  ]

  try {
    const results = await doSearchRequest({
      jwtToken: getJwtToken(event),
      method: 'get',
      path: '/search/autocomplete',
      params: buildParams({
        body,
        permittedCmrKeys,
        nonIndexedKeys,
        stringifyResult: false
      }),
      requestId,
      earthdataEnvironment
    })

    console.log(`Autocomplete Params: ${JSON.stringify(params)}, Results: ${results.body}`)

    return results
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default autocomplete
