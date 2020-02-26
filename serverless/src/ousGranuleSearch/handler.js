import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../util/parseError'

/**
 * Perform an authenticated OUS Granule search
 * @param {Object} event Details about the HTTP request that it received
 */
const ousGranuleSearch = async (event) => {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'exclude_granules',
    'granules',
    'format',
    'temporal',
    'variables'
  ]

  const nonIndexedKeys = [
    'variables'
  ]

  const { body } = event

  const { requestId } = JSON.parse(body)

  const { defaultResponseHeaders } = getApplicationConfig()

  // We need echo_collection_id to construct the URL but it is not listed
  // as a permitted key so it will be ignored when the request is made
  const { params = {} } = JSON.parse(body)
  const { echo_collection_id: echoCollectionId } = params

  try {
    return doSearchRequest({
      jwtToken: getJwtToken(event),
      path: `/service-bridge/ous/collection/${echoCollectionId}`,
      params: buildParams({
        body,
        permittedCmrKeys,
        nonIndexedKeys,
        stringifyResult: false
      }),
      requestId,
      bodyType: 'json'
    })
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default ousGranuleSearch
