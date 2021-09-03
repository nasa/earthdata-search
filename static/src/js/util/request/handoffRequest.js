import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for handoff requests
 */
export default class HandoffRequest extends Request {
  constructor(earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true
  }

  fetchSotoLayers() {
    return this.get('soto_layers')
  }
}
