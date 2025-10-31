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

  fetch(id) {
    return this.get(`retrievals/${id}`)
  }

  submit(params) {
    return this.post('retrievals', params)
  }

  fetchLinks(paramString) {
    return this.get(`granule_links${paramString}&requestId=${this.requestId}`)
  }
}
