import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

export default class AccessMethodsRequest extends Request {
  constructor(authToken) {
    const cmrEnvironment = cmrEnv()

    super(getEarthdataConfig(cmrEnvironment).apiHost)
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
