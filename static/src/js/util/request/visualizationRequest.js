import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

export default class VisualizationRequest extends Request {
  constructor(earthdataEnvironment) {
    super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

    this.searchPath = 'search/visualizations.umm_json'
  }

  search(params) {
    return this.get(this.searchPath, params)
  }
}
