import { buildURL, doSearchRequest } from './util'

/**
 * Handler to perform an authenticated CMR Timeline search
 * @param {object} event Event Data
 */
export default async function timelineSearch(event) {
  const { body, requestContext } = event
  const { jwtToken } = requestContext.authorizer

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'echo_collection_id',
    'end_date',
    'interval',
    'start_date'
  ]

  return doSearchRequest(jwtToken, buildURL({
    body,
    path: '/search/granules/timeline.json',
    permittedCmrKeys
  }))
}
