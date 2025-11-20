import Request from './request'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class RetrievalRequest extends Request {
  constructor(edlToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.lambda = true
    this.edlToken = edlToken
  }

  all() {
    return this.get('retrievals')
  }

  remove(id) {
    return this.delete(`retrievals/${id}`)
  }
}
