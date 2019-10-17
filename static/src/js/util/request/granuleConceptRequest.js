import Request from './request'
import { getEarthdataConfig, getEnvironmentConfig, getApplicationConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

/**
 * Request object for concept specific requests
 */
export default class GranuleConceptRequest extends Request {
  constructor(authToken) {
    const cmrEnvironment = cmrEnv()

    if (authToken && authToken !== '') {
      super(getEnvironmentConfig().apiHost)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'concepts'
    } else {
      super(getEarthdataConfig(cmrEnvironment).cmrHost)

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
    headers.Accept = `application/vnd.nasa.cmr.umm_results+json; version=${getApplicationConfig().ummGranuleVersion}`

    return super.transformRequest(data, headers)
  }
}
