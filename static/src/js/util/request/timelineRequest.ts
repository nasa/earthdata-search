import CmrRequest from './cmrRequest'

// @ts-expect-error Types are not defined for this module
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for timeline specific requests
 */
export default class TimelineRequest extends CmrRequest {
  constructor(edlToken: string | null, earthdataEnvironment: string) {
    super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

    this.searchPath = 'search/granules/timeline'

    if (edlToken) {
      this.authenticated = true
      this.edlToken = edlToken
    }
  }

  permittedCmrKeys() {
    return [
      'bounding_box',
      'concept_id',
      'end_date',
      'interval',
      'point',
      'polygon',
      'start_date'
    ]
  }

  nonIndexedKeys() {
    return [
      'bounding_box',
      'concept_id',
      'point',
      'polygon'
    ]
  }
}
