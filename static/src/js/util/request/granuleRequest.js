import Request from './request'
import { getApplicationConfig, getEarthdataConfig } from '../../../../../sharedUtils/config'

import { getTemporal } from '../edscDate'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

/**
 * Request object for granule specific requests
 */
export default class GranuleRequest extends Request {
  constructor(authToken) {
    const cmrEnvironment = cmrEnv()

    if (authToken && authToken !== '') {
      super(getEarthdataConfig(cmrEnvironment).apiHost)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'granules'
    } else {
      super(getEarthdataConfig(cmrEnvironment).cmrHost)

      this.searchPath = 'search/granules.json'
    }
  }

  permittedCmrKeys() {
    return [
      'bounding_box',
      'echo_collection_id',
      'page_num',
      'page_size',
      'point',
      'polygon',
      'sort_key',
      'temporal',
      'two_d_coordinate_system'
    ]
  }

  nonIndexedKeys() {
    return [
      'sort_key'
    ]
  }

  transformResponse(data) {
    super.transformResponse(data)

    // If the response status code is not 200, return unaltered data
    // If the status code is 200, it doesn't exist in the response
    const { statusCode = 200 } = data
    if (statusCode !== 200) return data

    const { feed = {} } = data
    const { entry = [] } = feed

    entry.map((granule) => {
      const updatedGranule = granule

      updatedGranule.is_cwic = false

      updatedGranule.formatted_temporal = getTemporal(granule.time_start, granule.time_end)

      const h = getApplicationConfig().thumbnailSize.height
      const w = getApplicationConfig().thumbnailSize.width

      if (granule.id) {
        // eslint-disable-next-line
        updatedGranule.thumbnail = `${getEarthdataConfig(cmrEnv()).cmrHost}/browse-scaler/browse_images/granules/${granule.id}?h=${h}&w=${w}`
      }

      return updatedGranule
    })

    return {
      feed: {
        entry
      }
    }
  }
}
