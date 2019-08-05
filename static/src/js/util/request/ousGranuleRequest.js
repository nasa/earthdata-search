import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for granule specific requests
 */
export default class OusGranuleRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)
    this.authenticated = true
    this.authToken = authToken
    this.searchPath = '/granules/ous'
  }

  permittedCmrKeys() {
    // We need echo_collection_id to construct the URL for the request to CMR
    // so its permitted here but it is not permitted in the lambda function
    return [
      'bounding_box',
      'echo_collection_id',
      'exclude_granules',
      'granules',
      'format',
      'temporal',
      'variables'
    ]
  }
}
