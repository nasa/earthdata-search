import CmrRequest from './cmrRequest'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for NLP search requests to CMR
 * Calls CMR NLP endpoint directly
 */
export default class NlpSearchRequest extends CmrRequest {
  constructor(earthdataEnvironment) {
    super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)
  }

  stream(prompt, options = {}) {
    const query = encodeURIComponent(prompt || '')

    return super.stream(`/nlp?query=${query}`, options)
  }
}
