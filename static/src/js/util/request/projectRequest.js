import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ProjectRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)
    this.lambda = true

    if (authToken && authToken.length > 0) {
      this.authenticated = true
      this.authToken = authToken
    }
  }

  all() {
    this.authenticated = true
    return this.get('projects')
  }

  save(params) {
    return this.post('projects', params)
  }

  fetch(projectId) {
    return this.get(`projects/${projectId}`)
  }

  remove(projectId) {
    return this.delete(`projects/${projectId}`)
  }
}
