import Request from './request'
// @ts-expect-error This file does not have types
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { HarmonyRequestParams } from '../../types/sharedTypes'

export default class HarmonyCapabilitiesRequest extends Request {
  constructor(edlToken: string, earthdataEnvironment: string) {
    super(getEarthdataConfig(earthdataEnvironment).harmonyHost, earthdataEnvironment)

    this.authenticated = true
    this.edlToken = edlToken
    this.searchPath = 'capabilities'
  }

  search(params: HarmonyRequestParams) {
    return this.getSearch(params)
  }
}
