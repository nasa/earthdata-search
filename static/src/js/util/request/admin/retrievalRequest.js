import Request from '../request'
import { getEnvironmentConfig } from '../../../../../../sharedUtils/config'

export default class RetrievalRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)
    this.authenticated = true
    this.authToken = authToken
  }

  all() {
    return this.get('admin/retrievals')
  }

  fetch(id) {
    return this.get(`admin/retrievals/${id}`)
  }

  isAuthorized() {
    return this.get('/admin/is_authorized')
  }
}
