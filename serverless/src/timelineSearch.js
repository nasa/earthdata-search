import {
  buildURL,
  doSearchRequest,
  getJwtToken
} from './util'

/**
 * Handler to perform an authenticated CMR Timeline search
 * @param {object} event Event Data
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
