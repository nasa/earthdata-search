import CmrRequest from './cmrRequest'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for NLP search requests
 */
export default class NlpSearchRequest extends CmrRequest {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true // Route through our backend lambda

    if (authToken && authToken !== '') {
      this.authenticated = true
      this.authToken = authToken
    } else {
      this.optionallyAuthenticated = true
    }

    this.searchPath = 'nlpSearch'
  }

  /**
   * Defines the default array keys that should exclude their index when stringified.
   * @return {Array} An empty array
   */
  nonIndexedKeys() {
    return []
  }

  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} Array of permitted CMR keys for NLP search
   */
  permittedCmrKeys() {
    return [
      'q'
    ]
  }
}