import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ShapefileRequest extends Request {
  constructor(earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true
  }

  fetch(shapefileId) {
    return this.get(`shapefiles/${shapefileId}`)
  }

  save(params) {
    return this.post('shapefiles', params)
  }
}
