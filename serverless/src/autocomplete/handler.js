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
  const { body } = event

  const { params, requestId } = JSON.parse(body)
  const { q } = params

  const { defaultResponseHeaders } = getApplicationConfig()

  const permittedCmrKeys = [
    'q',
    'type'
  ]

  const nonIndexedKeys = [
    'type'
  ]

  console.log(`Searching for ${q}`)

  try {
    return doSearchRequest({
      jwtToken: getJwtToken(event),
      method: 'get',
      path: '/search/autocomplete',
      params: buildParams({
        body,
        permittedCmrKeys,
        nonIndexedKeys
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
