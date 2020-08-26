import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ShapefileRequest extends Request {
  constructor() {
    super(getEnvironmentConfig().apiHost)
    this.lambda = true
  }

  fetch(shapefileId) {
    return this.get(`shapefiles/${shapefileId}`)
  }

  save(params) {
    return this.post('shapefiles', params)
  }
}
