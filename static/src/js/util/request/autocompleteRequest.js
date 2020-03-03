import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for autocomplete requests
 */
export default class AutocompleteRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)

    this.lambda = true

    if (authToken && authToken !== '') {
      this.authenticated = true
      this.authToken = authToken
    }

    this.searchPath = 'autocomplete'
  }

  /**
 * Defines the default array keys that should exclude their index when stringified.
 * @return {Array} An empty array
 */
  nonIndexedKeys() {
    return [
      'type'
    ]
  }

  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys() {
    return [
      'type',
      'q'
    ]
  }
}
