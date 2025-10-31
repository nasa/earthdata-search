import CmrRequest from './cmrRequest'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for autocomplete requests
 */
export default class AutocompleteRequest extends CmrRequest {
  constructor(edlToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true

    if (edlToken && edlToken !== '') {
      this.authenticated = true
      this.edlToken = edlToken
    } else {
      this.optionallyAuthenticated = true
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
