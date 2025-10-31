import Request from '../request'
import { getEnvironmentConfig } from '../../../../../../sharedUtils/config'

export default class retrievalsMetricsRequest extends Request {
  constructor(edlToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.edlToken = edlToken
  }

  all(params) {
    return this.get('admin/retrievals_metrics', params)
  }
}
