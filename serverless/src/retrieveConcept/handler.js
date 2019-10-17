import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { cmrStringify } from '../util/cmr/cmrStringify'
import { isWarmUp } from '../util/isWarmup'
import { pick } from '../util/pick'

/**
 * Perform an authenticated CMR concept search
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const retrieveConcept = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { queryStringParameters } = event

  const permittedCmrKeys = ['pretty']

  const obj = pick(queryStringParameters, permittedCmrKeys)
  const queryParams = cmrStringify(obj)

  const conceptUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}`
    + `/search/concepts/${event.pathParameters.id}?${queryParams}`

  return doSearchRequest(getJwtToken(event), conceptUrl, {
    Accept: `application/vnd.nasa.cmr.umm_results+json; version=${getApplicationConfig().ummCollectionVersion}`
  })
}

export default retrieveConcept
