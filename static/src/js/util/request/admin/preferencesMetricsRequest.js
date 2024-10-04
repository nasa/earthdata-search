import Request from '../request'
import { getEnvironmentConfig } from '../../../../../../sharedUtils/config'

export default class preferencesMetricsRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  all() {
    return this.get('admin/preferences_metrics')
  }
}
