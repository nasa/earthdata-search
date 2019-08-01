import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

export default class NlpRequest extends Request {
  constructor() {
    const cmrEnvironment = cmrEnv()

    super(getEarthdataConfig(cmrEnvironment).apiHost)
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
