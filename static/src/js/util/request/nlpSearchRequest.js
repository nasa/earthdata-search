import { pick } from 'lodash-es'
import CmrRequest from './cmrRequest'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for NLP search requests
 */
export default class NlpSearchRequest extends CmrRequest {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true

    if (authToken && authToken !== '') {
      this.authenticated = true
      this.authToken = authToken
    } else {
      this.optionallyAuthenticated = true
    }

    this.searchPath = 'nlpSearch'
  }

  /**
   * Override filterData to skip snake_case conversion for NLP API
   * NLP API expects camelCase parameters, unlike traditional CMR endpoints
   * @param {Object} data - An object representing an HTTP request payload
   */
  filterData(data) {
    if (data) {
      // NLP API expects camelCase keys, so skip snake_case conversion
      return pick(data, this.permittedCmrKeys())
    }

    return data
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
   * NLP API expects camelCase parameters, unlike traditional CMR endpoints
   * @return {Array} Array of permitted CMR keys for NLP search
   */
  permittedCmrKeys() {
    return [
      'q',
      'pageNum',
      'pageSize'
    ]
  }
}
