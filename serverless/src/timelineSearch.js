import { buildURL, doSearchRequest } from './util'

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
