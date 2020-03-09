import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { buildParams } from '../util/cmr/buildParams'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../util/parseError'

/**
 * Perform a search across all endpoints for autocompletion
 * @param {Object} event Details about the HTTP request that it received
 */
const autocomplete = async (event) => {
  console.log(event)
  const { body } = event

  const { requestId } = JSON.parse(body)

  const { defaultResponseHeaders } = getApplicationConfig()

  const permittedCmrKeys = [
    'q',
    'type'
  ]

  const nonIndexedKeys = [
    'type'
  ]

  try {
    return doSearchRequest({
      jwtToken: getJwtToken(event),
      method: 'get',
      bodyType: 'json',
      path: '/search/autocomplete',
      params: buildParams({
        body,
        permittedCmrKeys,
        nonIndexedKeys,
        stringifyResult: false
      }),
      requestId
    })
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default autocomplete
