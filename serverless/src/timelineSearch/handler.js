import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Perform an authenticated CMR Timeline search
 * @param {Object} event Details about the HTTP request that it received
 */
const timelineSearch = async (event) => {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'concept_id',
    'end_date',
    'interval',
    'start_date'
  ]

  const nonIndexedKeys = [
    'concept_id'
  ]

  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event

  const { requestId } = JSON.parse(body)

  try {
    return doSearchRequest({
      jwtToken: getJwtToken(event),
      path: '/search/granules/timeline',
      params: buildParams({
        body,
        nonIndexedKeys,
        permittedCmrKeys
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

export default timelineSearch
