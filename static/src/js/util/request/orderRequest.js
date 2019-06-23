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
      'environment'
    ]
  }

  submit(params) {
    return this.post('/orders', params)
  }
}
