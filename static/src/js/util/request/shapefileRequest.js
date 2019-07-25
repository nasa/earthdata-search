import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

export default class ShapefileRequest extends Request {
  constructor() {
    super(getEarthdataConfig('prod').apiHost)
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
