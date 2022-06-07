import { pick } from 'lodash'

import { buildParams } from '../util/cmr/buildParams'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'
import { collectionRequestPermittedCmrKeys } from '../../../sharedConstants/permittedCmrKeys'
import { collectionRequestNonIndexedCmrKeys } from '../../../sharedConstants/nonIndexedCmrKeys'

/**
 * Perform an authenticated CMR Collection search
 * @param {Object} event Details about the HTTP request that it received
 */
const collectionSearch = async (event) => {
  const { body, headers } = event

  const { defaultResponseHeaders } = getApplicationConfig()

  const { requestId } = JSON.parse(body)

  // The 'Accept' header contains the UMM version
  const providedHeaders = pick(headers, ['Accept'])

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  try {
    return doSearchRequest({
      jwtToken: getJwtToken(event),
      path: '/search/collections.json',
      params: buildParams({
        body,
        // Certain CMR keys will cause errors if indexes are provided
        nonIndexedKeys: collectionRequestNonIndexedCmrKeys,
        // Whitelist keys allowed in the collecitons request
        permittedCmrKeys: collectionRequestPermittedCmrKeys
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

export default collectionSearch
