import { doSearchRequest } from './util/cmr/doSearchRequest'
import { getJwtToken } from './util'

import { getEarthdataConfig } from '../../sharedUtils/config'
import { cmrEnv } from '../../sharedUtils/cmrEnv'

/**
 * Handler to perform an authenticated CMR concept search
 */
function retrieveConcept(event) {
  const conceptUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}`
    + `/search/concepts/${event.pathParameters.id}?pretty=true`

  console.log(conceptUrl)

  return doSearchRequest(getJwtToken(event), conceptUrl)
}

export default retrieveConcept
