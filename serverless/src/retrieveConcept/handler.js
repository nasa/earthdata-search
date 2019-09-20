import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'

/**
 * Perform an authenticated CMR concept search
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const retrieveConcept = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const conceptUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}`
    + `/search/concepts/${event.pathParameters.id}?pretty=true`

  return doSearchRequest(getJwtToken(event), conceptUrl)
}

export default retrieveConcept
