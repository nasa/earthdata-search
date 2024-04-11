import Request from './request'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class PreferencesRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  update(params) {
    return this.post('preferences', params)
  }
}
