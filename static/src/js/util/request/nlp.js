import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

export default class NlpRequest extends Request {
  constructor() {
    super(getEarthdataConfig('sit').apiHost)
    this.lambda = true
    this.searchPath = 'nlp'
  }

  /**
   * Defines the default array keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys() {
    return [
      'text'
    ]
  }
}
