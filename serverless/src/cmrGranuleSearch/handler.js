import { pick } from 'lodash'

import { buildParams } from '../util/cmr/buildParams'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'
import { granuleRequestPermittedCmrKeys } from '../../../sharedConstants/permittedCmrKeys'
import { granuleRequestNonIndexedCmrKeys } from '../../../sharedConstants/nonIndexedCmrKeys'

/**
 * Perform an authenticated CMR Granule search
 * @param {Object} event Details about the HTTP request that it received
 */
const cmrGranuleSearch = async (event) => {
  const { body, headers } = event

  const { defaultResponseHeaders } = getApplicationConfig()

  const { requestId } = JSON.parse(body)

  // The 'Accept' header contains the UMM version
  const providedHeaders = pick(headers, ['Accept'])

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  try {
    return doSearchRequest({
      jwtToken: getJwtToken(event),
      path: '/search/granules.json',
      params: buildParams({
        body,
        permittedCmrKeys: granuleRequestPermittedCmrKeys,
        nonIndexedKeys: granuleRequestNonIndexedCmrKeys
      }),
      providedHeaders,
      requestId,
      earthdataEnvironment
    })
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default cmrGranuleSearch
