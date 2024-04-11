import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class RegionRequest extends Request {
  constructor(earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true
    this.searchPath = 'regions'
  }

  search(params) {
    return this.get(this.searchPath, params)
  }
}
