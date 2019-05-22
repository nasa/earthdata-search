import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for concept specific requests
 */
export default class ConceptRequest extends Request {
  constructor(authToken) {
    if (authToken && authToken !== '') {
      super(getEarthdataConfig('prod').apiHost)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'concepts'
    } else {
      super(getEarthdataConfig('prod').cmrHost)

      this.searchPath = 'search/concepts'
    }
  }

  search(conceptId, format) {
    return super.get(`${this.searchPath}/${conceptId}.${format}`)
  }
}
