import {
  doSearchRequest,
  getJwtToken
} from './util'

import { getConfig } from '../../sharedUtils/config'

/**
 * Handler to perform an authenticated CMR concept search
 */
function retrieveConcept(event) {
  const conceptUrl = `${getConfig('prod').cmrHost}`
    + `/search/concepts/${event.pathParameters.id}`

  console.log(conceptUrl)

  return doSearchRequest(getJwtToken(event), conceptUrl)
}

export default retrieveConcept
