import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

/**
 * Request object for concept specific requests
 */
export default class ConceptRequest extends Request {
  constructor(authToken) {
    const cmrEnvironment = cmrEnv()

    if (authToken && authToken !== '') {
      super(getEarthdataConfig(cmrEnvironment).apiHost)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'concepts'
    } else {
      super(getEarthdataConfig(cmrEnvironment).cmrHost)

      this.searchPath = 'search/concepts'
    }
  }

  search(conceptId, format) {
    return super.get(`${this.searchPath}/${conceptId}.${format}`)
  }
}
