import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ColorMapRequest extends Request {
  constructor(earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)
    this.lambda = true
  }

  getColorMap(product) {
    return this.get(`colormaps/${product}`)
  }
}
