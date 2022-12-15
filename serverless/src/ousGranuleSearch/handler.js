import { buildParams } from '../util/cmr/buildParams'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

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
    'page_num',
    'page_size',
    'temporal',
    'variables'
  ]

  const nonIndexedKeys = [
    'variables'
  ]

  const { body, headers } = event

  const { params = {}, requestId } = JSON.parse(body)

  // We need echo_collection_id to construct the URL but it is not listed
  // as a permitted key so it will be ignored when the request is made
  const { echo_collection_id: echoCollectionId } = params

  const { defaultResponseHeaders } = getApplicationConfig()

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

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
      earthdataEnvironment,
      providedHeaders: {
        Accept: 'application/vnd.cmr-service-bridge.v3+json'
      }
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
