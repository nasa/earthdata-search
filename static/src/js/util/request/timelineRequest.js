import CmrRequest from './cmrRequest'
import { getEarthdataConfig, getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

/**
 * Request object for timeline specific requests
 */
export default class TimelineRequest extends CmrRequest {
  constructor(authToken) {
    const cmrEnvironment = cmrEnv()

    if (authToken && authToken !== '') {
      super(getEnvironmentConfig().apiHost)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'granules/timeline'
    } else {
      super(getEarthdataConfig(cmrEnvironment).cmrHost)

      this.searchPath = 'search/granules/timeline'
    }
  }

  permittedCmrKeys() {
    return [
      'concept_id',
      'end_date',
      'interval',
      'start_date'
    ]
  }

  nonIndexedKeys() {
    return [
      'concept_id'
    ]
  }
}
