import Request from './request'
// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class SavedAccessConfigsRequest extends Request {
  constructor(edlToken: string, earthdataEnvironment: string) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.lambda = true
    this.edlToken = edlToken
    this.searchPath = 'saved_access_configs'
  }
}
