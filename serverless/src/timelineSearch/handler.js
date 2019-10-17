import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { isWarmUp } from '../util/isWarmup'

/**
 * Perform an authenticated CMR Timeline search
 * @param {Object} event Details about the HTTP request that it received
 */
const timelineSearch = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

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

  return doSearchRequest(
    getJwtToken(event),
    '/search/granules/timeline',
    buildParams({
      body,
      nonIndexedKeys,
      permittedCmrKeys
    })
  )
}

export default timelineSearch
