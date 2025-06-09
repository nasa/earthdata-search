import Request from './request'

// @ts-expect-error Types are not defined for this module
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import { RequestParams } from '../../types/sharedTypes'

export default class ProjectRequest extends Request {
  constructor(authToken: string, earthdataEnvironment: string) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true

    if (authToken && authToken.length > 0) {
      this.authenticated = true
      this.authToken = authToken
    }
  }

  adminFetch(projectId: string) {
    return this.get(`admin/projects/${projectId}`)
  }

  adminAll(params: RequestParams) {
    this.authenticated = true

    return this.get('admin/projects', params)
  }

  all() {
    this.authenticated = true

    return this.get('projects')
  }

  save(params: RequestParams) {
    return this.post('projects', params)
  }

  fetch(projectId: string) {
    return this.get(`projects/${projectId}`)
  }

  remove(projectId: string) {
    return this.delete(`projects/${projectId}`)
  }
}
