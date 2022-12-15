import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ProjectRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true

    if (authToken && authToken.length > 0) {
      this.authenticated = true
      this.authToken = authToken
    }
  }

  adminFetch(projectId) {
    return this.get(`admin/projects/${projectId}`)
  }

  adminAll(params) {
    this.authenticated = true
    return this.get('admin/projects', params)
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
