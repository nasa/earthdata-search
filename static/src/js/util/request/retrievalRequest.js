import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

export default class RetrievalRequest extends Request {
  constructor(authToken) {
    super(getEarthdataConfig('sit').apiHost)
    this.authenticated = true
    this.authToken = authToken
  }

  permittedCmrKeys() {
    return [
      'collections',
      'environment',
      'json_data'
    ]
  }

  collections(id) {
    return this.get(`/retrievals/${id}/collections`)
  }

  submit(params) {
    return this.post('/retrievals', params)
  }
}
