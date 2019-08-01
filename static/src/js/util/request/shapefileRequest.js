import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ShapefileRequest extends Request {
  constructor() {
    super(getEnvironmentConfig().apiHost)
    this.lambda = true
  }

  permittedCmrKeys() {
    return [
      'file',
      'filename',
      'auth_token'
    ]
  }

  save(params) {
    return this.post('save_shapefile', params)
  }
}
