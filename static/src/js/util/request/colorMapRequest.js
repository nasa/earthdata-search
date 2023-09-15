import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ColorMapRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)
    this.authenticated = true
    this.authToken = authToken
  }

  getColorMap(product) {
    return this.get(`colormaps/${product}`)
  }
}
