import CmrRequest from './cmrRequest'

import { getEarthdataConfig, getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { getUmmGranuleVersionHeader } from '../../../../../sharedUtils/ummVersionHeader'

/**
 * Request object for concept specific requests
 */
export default class GranuleConceptRequest extends CmrRequest {
  constructor(authToken, earthdataEnvironment) {
    if (authToken && authToken !== '') {
      super(getEnvironmentConfig().apiHost, earthdataEnvironment)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'concepts'
    } else {
      super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

      this.searchPath = 'search/concepts'
    }
  }

  permittedCmrKeys() {
    return ['pretty']
  }

  search(conceptId, format, params) {
    return this.get(`${this.searchPath}/${conceptId}.${format}`, params)
  }

  /**
 * Modifies the payload just before the request is sent.
 * @param {Object} data - An object containing any keys.
 * @param {Object} headers - An object containing headers that will be sent with the request.
 * @return {Object} A modified object.
 */
  transformRequest(data, headers) {
    // eslint-disable-next-line no-param-reassign
    headers.Accept = getUmmGranuleVersionHeader()

    return super.transformRequest(data, headers)
  }
}
