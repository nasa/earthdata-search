import { pick } from 'lodash'

import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class PreferencesRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)
    this.authenticated = true
    this.authToken = authToken
  }

  permittedCmrKeys() {
    return ['preferences']
  }

  update(params) {
    return this.post('preferences', params)
  }

  /**
   * Overwrite Request#transformRequest because we don't want to snake case this data.
   * @param {*} data - An object containing any keys.
   * @param {*} headers - Request headers.
   */
  transformRequest(data, headers) {
    // eslint-disable-next-line no-param-reassign
    headers.Authorization = `Bearer: ${this.getAuthToken()}`

    const filteredData = pick(data, this.permittedCmrKeys())

    return JSON.stringify({
      requestId: this.requestId,
      params: filteredData
    })
  }
}
