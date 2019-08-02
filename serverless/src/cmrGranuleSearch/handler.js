import { buildURL } from '../util/cmr/buildUrl'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { isWarmUp } from '../util/isWarmup'

/**
 * Handler to perform an authenticated CMR Granule search
 */
const cmrGranuleSearch = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'echo_collection_id',
    'format',
    'page_num',
    'page_size',
    'point',
    'polygon',
    'sort_key',
    'temporal',
    'two_d_coordinate_system'
  ]

  const { body } = event

  return doSearchRequest(getJwtToken(event), buildURL({
    body,
    path: '/search/granules.json',
    permittedCmrKeys
  }))
}

export default cmrGranuleSearch
