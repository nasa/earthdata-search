import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ProjectRequest extends Request {
  constructor() {
    super(getEnvironmentConfig().apiHost)
    this.lambda = true
  }

  permittedCmrKeys() {
    return [
      'auth_token',
      'name',
      'path',
      'project_id'
    ]
  }

  save(params) {
    return this.post('save_project', params)
  }

  get(projectId) {
    return super.get(`get_project?projectId=${projectId}`)
  }
}
