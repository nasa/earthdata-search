import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

export default class OrderRequest extends Request {
  constructor(authToken) {
    const cmrEnvironment = cmrEnv()

    super(getEarthdataConfig(cmrEnvironment).apiHost)
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
