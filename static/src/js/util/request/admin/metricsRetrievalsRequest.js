import Request from '../request'
import { getEnvironmentConfig } from '../../../../../../sharedUtils/config'

export default class MetricsRetrievalsRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  all(params) {
    const fullList = this.get('admin/retrievalsMetrics', params)
    // console.log('🚀 ~ file: retrievalRequest.js:14 ~ RetrievalRequest ~ all ~ fullList:', fullList)
    return fullList
  }

  fetch(id) {
    return this.get(`admin/retrievalsMetrics/${id}`)
  }

  // todo this may not be the correct method
  isAuthorized() {
    return this.get('admin/is_authorized')
  }

  // TODO REMOVE THIS
  requeueOrder(params) {
    return this.post('metricsRequeue_order', params)
  }
}
