import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class RegionRequest extends Request {
  constructor() {
    super(getEnvironmentConfig().apiHost)
    this.lambda = true
    this.searchPath = 'regions'
  }

  permittedCmrKeys() {
    return [
      'endpoint',
      'exact',
      'query'
    ]
  }

  search(params) {
    return this.get(this.searchPath, params)
  }
}
