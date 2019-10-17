import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { isWarmUp } from '../util/isWarmup'

/**
 * Perform an authenticated OUS Granule search
 * @param {Object} event Details about the HTTP request that it received
 */
const ousGranuleSearch = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

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

  // We need echo_collection_id to construct the URL but it is not listed
  // as a permitted key so it will be ignored when the request is made
  const { params = {} } = JSON.parse(body)
  const { echo_collection_id: echoCollectionId } = params

  return doSearchRequest(
    getJwtToken(event),
    `/service-bridge/ous/collection/${echoCollectionId}`,
    buildParams({
      body,
      permittedCmrKeys,
      nonIndexedKeys
    })
  )
}

export default ousGranuleSearch
