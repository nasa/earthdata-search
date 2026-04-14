import Request from './request'
// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class HarmonyCapabilitiesRequest extends Request {
  constructor(edlToken: string, earthdataEnvironment: string) {
    super(getEnvironmentConfig().harmonyHost, earthdataEnvironment)

    this.authenticated = true
    this.edlToken = edlToken
    this.searchPath = 'capabilities'
  }

  searchHarmonyCapabilities(collectionId: string) {
    return this.get('capabilities', { collectionId })
  }
}
