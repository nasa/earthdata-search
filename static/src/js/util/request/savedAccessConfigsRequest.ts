import Request from './request'
// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class SavedAccessConfigsRequest extends Request {
  constructor(authToken: string, earthdataEnvironment: string) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
    this.searchPath = 'saved_access_configs'
  }
}
