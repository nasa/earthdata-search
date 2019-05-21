import Request from './request'
import getConfig from '../../../../../sharedUtils/config'

/**
 * Request object for timeline specific requests
 */
export default class TimelineRequest extends Request {
  constructor(authToken) {
    if (authToken && authToken !== '') {
      super(getConfig('prod').apiHost)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'granules/timeline'
    } else {
      super(getConfig('prod').cmrHost)

      this.searchPath = 'search/granules/timeline.json'
    }
  }

  permittedCmrKeys() {
    return [
      'echo_collection_id',
      'end_date',
      'interval',
      'start_date'
    ]
  }
}
