import { buildURL } from './util/cmr/buildUrl'
import { doSearchRequest } from './util/cmr/doSearchRequest'
import { getJwtToken } from './util'

/**
 * Handler to perform an authenticated CMR Timeline search
 */
export default async function timelineSearch(event) {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'echo_collection_id',
    'end_date',
    'interval',
    'start_date'
  ]

  const { body } = event

  return doSearchRequest(getJwtToken(event), buildURL({
    body,
    path: '/search/granules/timeline.json',
    permittedCmrKeys
  }))
}
