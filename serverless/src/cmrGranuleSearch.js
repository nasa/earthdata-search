import { buildURL } from './util/cmr/buildUrl'
import { doSearchRequest } from './util/cmr/doSearchRequest'
import { getJwtToken } from './util'

/**
 * Handler to perform an authenticated CMR Granule search
 */
export default async function cmrGranuleSearch(event) {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'echo_collection_id',
    'format',
    'page_num',
    'page_size',
    'sort_key',
    'temporal'
  ]

  const { body } = event

  return doSearchRequest(getJwtToken(event), buildURL({
    body,
    path: '/search/granules.json',
    permittedCmrKeys
  }))
}
