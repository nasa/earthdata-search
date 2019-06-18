import { buildURL } from './util/cmr/buildUrl'
import { doSearchRequest } from './util/cmr/doSearchRequest'
import { getJwtToken } from './util'

/**
 * Handler to perform an authenticated CMR Timeline search
 */
export default async function timelineSearch(event) {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'concept_id',
    'end_date',
    'interval',
    'start_date'
  ]

  const nonIndexedKeys = [
    'concept_id'
  ]

  const { body } = event

  return doSearchRequest(getJwtToken(event), buildURL({
    body,
    nonIndexedKeys,
    path: '/search/granules/timeline',
    permittedCmrKeys
  }))
}
