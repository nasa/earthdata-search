import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

export default class AccessMethodsRequest extends Request {
  constructor(authToken) {
    super(getEarthdataConfig('prod').apiHost)
    this.authenticated = true
    this.authToken = authToken
    this.searchPath = '/access_methods'
  }

  permittedCmrKeys() {
    return [
      'collection_id',
      'tags'
    ]
  }
}
