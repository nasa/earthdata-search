import {
  buildURL,
  doSearchRequest,
  getJwtToken
} from './util'

/**
 * Handler to perform an authenticated CMR Granule search
 * @param {object} event Event Data
 */
export default async function cmrGranuleSearch(event) {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'echo_collection_id',
    'format',
    'page_num',
    'page_size',
    'sort_key'
  ]

  const { body } = event

  return doSearchRequest(getJwtToken(event), buildURL({
    body,
    path: '/search/granules.json',
    permittedCmrKeys
  }))
}
