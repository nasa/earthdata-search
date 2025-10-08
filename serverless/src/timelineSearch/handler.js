import { buildParams } from '../util/cmr/buildParams'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Perform an authenticated CMR Timeline search
 * @param {Object} event Details about the HTTP request that it received
 */
const timelineSearch = async (event) => {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'concept_id',
    'end_date',
    'interval',
    'point',
    'polygon',
    'start_date'
  ]

  const nonIndexedKeys = [
    'bounding_box',
    'concept_id',
    'point',
    'polygon'
  ]

  const { body, headers } = event

  const { requestId, params: requestParams = {} } = JSON.parse(body)

  const { defaultResponseHeaders } = getApplicationConfig()

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  // Validate that concept_id is present and not empty
  // This prevents unbounded timeline requests to CMR that search across all collections
  const { concept_id: conceptId } = requestParams

  if (!conceptId || (Array.isArray(conceptId) && conceptId.length === 0)) {
    return {
      isBase64Encoded: false,
      statusCode: 400,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        errors: ['Timeline requests must include at least one collection concept_id']
      })
    }
  }

  try {
    return doSearchRequest({
      jwtToken: getJwtToken(event),
      path: '/search/granules/timeline',
      params: buildParams({
        body,
        nonIndexedKeys,
        permittedCmrKeys
      }),
      requestId,
      earthdataEnvironment
    })
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default timelineSearch
