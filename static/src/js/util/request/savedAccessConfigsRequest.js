import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class SavedAccessConfigsRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
    this.searchPath = 'saved_access_configs'
  }

  get(params) {
    super.get(this.searchPath, params)
  }
}
