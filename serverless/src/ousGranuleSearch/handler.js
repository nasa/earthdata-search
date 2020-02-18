import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { logLambdaEntryTime } from '../util/logging/logLambdaEntryTime'

/**
 * Perform an authenticated OUS Granule search
 * @param {Object} event Details about the HTTP request that it received
 */
const ousGranuleSearch = async (event, context) => {
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

  const { invocationTime, requestId } = JSON.parse(body)

  logLambdaEntryTime(requestId, invocationTime, context)

  // We need echo_collection_id to construct the URL but it is not listed
  // as a permitted key so it will be ignored when the request is made
  const { params = {} } = JSON.parse(body)
  const { echo_collection_id: echoCollectionId } = params

  return doSearchRequest({
    jwtToken: getJwtToken(event),
    path: `/service-bridge/ous/collection/${echoCollectionId}`,
    params: buildParams({
      body,
      permittedCmrKeys,
      nonIndexedKeys,
      stringifyResult: false
    }),
    invocationTime,
    requestId,
    bodyType: 'json'
  })
}

export default ousGranuleSearch
