import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for logging errors to lambda
 */
export default class LoggerRequest extends Request {
  constructor() {
    super(getEnvironmentConfig().apiHost)
    this.lambda = true
  }

  permittedCmrKeys() {
    return [
      'error',
      'data'
    ]
  }

  log(params) {
    return this.post('error_logger', params)
  }

  logRelevancy(params) {
    return this.post('relevancy_logger', params)
  }

  logSelectedAutocomplete(params) {
    return this.post('autocomplete_logger', params)
  }
}
