import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for logging errors to lambda
 */
export default class LoggerRequest extends Request {
  constructor(earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true
  }

  log(params) {
    return this.post('error_logger', params)
  }

  alert(params) {
    return this.post('alert_logger', params)
  }

  logRelevancy(params) {
    return this.post('relevancy_logger', params)
  }
}
