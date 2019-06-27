import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

export default class OrderRequest extends Request {
  constructor(authToken) {
    super(getEarthdataConfig('prod').apiHost)
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
    return this.post('/orders', params)
  }
}
