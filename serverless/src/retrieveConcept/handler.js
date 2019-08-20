import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'

/**
 * Handler to perform an authenticated CMR concept search
 */
const retrieveConcept = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const conceptUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}`
    + `/search/concepts/${event.pathParameters.id}?pretty=true`

  return doSearchRequest(getJwtToken(event), conceptUrl)
}

export default retrieveConcept
