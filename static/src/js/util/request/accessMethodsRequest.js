import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class AccessMethodsRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
    this.searchPath = 'access_methods'
  }
}
