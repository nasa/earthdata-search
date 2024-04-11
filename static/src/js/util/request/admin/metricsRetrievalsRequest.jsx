import Request from '../request'
import { getEnvironmentConfig } from '../../../../../../sharedUtils/config'

export default class MetricsRetrievalsRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  all(params) {
    return this.get('admin/retrievalsMetrics', params)
  }
}
