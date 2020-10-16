import Request from './request'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class DataQualitySummaryRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  fetch(params) {
    return this.post('dqs', params)
  }
}
