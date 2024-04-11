import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for concept specific requests
 */
export default class LogoutRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  logout() {
    return this.delete('logout')
  }
}
