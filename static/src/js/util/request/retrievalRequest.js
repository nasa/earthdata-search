import Request from './request'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class RetrievalRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  all() {
    return this.get('retrievals')
  }

  remove(id) {
    return this.delete(`retrievals/${id}`)
  }

  fetch(id) {
    return this.get(`retrievals/${id}`)
  }

  submit(params) {
    return this.post('retrievals', params)
  }
}
