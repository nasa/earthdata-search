import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ProviderRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  all() {
    return this.get('providers')
  }
}
