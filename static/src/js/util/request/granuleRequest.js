import CmrRequest from './cmrRequest'
import {
  getApplicationConfig,
  getEarthdataConfig,
  getEnvironmentConfig
} from '../../../../../sharedUtils/config'
import { granuleRequestNonIndexedCmrKeys } from '../../../../../sharedConstants/nonIndexedCmrKeys'
import { granuleRequestPermittedCmrKeys } from '../../../../../sharedConstants/permittedCmrKeys'

import { getTemporal } from '../edscDate'

/**
 * Request object for granule specific requests
 */
export default class GranuleRequest extends CmrRequest {
  constructor(authToken, earthdataEnvironment) {
    if (authToken && authToken !== '') {
      super(getEnvironmentConfig().apiHost, earthdataEnvironment)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'granules'
    } else {
      super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

      this.searchPath = 'search/granules.json'
    }
  }

  permittedCmrKeys() {
    return granuleRequestPermittedCmrKeys
  }

  nonIndexedKeys() {
    return granuleRequestNonIndexedCmrKeys
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

      updatedGranule.isOpenSearch = false

      const formattedTemporal = getTemporal(granule.time_start, granule.time_end)

      if (formattedTemporal.filter(Boolean).length > 0) {
        updatedGranule.formatted_temporal = formattedTemporal
      }

      const h = getApplicationConfig().thumbnailSize.height
      const w = getApplicationConfig().thumbnailSize.width

      if (granule.id) {
        // eslint-disable-next-line
        updatedGranule.thumbnail = `${getEarthdataConfig(this.earthdataEnvironment).cmrHost}/browse-scaler/browse_images/granules/${granule.id}?h=${h}&w=${w}`
      }

      if (granule.links && granule.links.length > 0) {
        let browseUrl

        // Pick the first 'browse' link to use as the browseUrl
        granule.links.some((link) => {
          if (link.rel.indexOf('browse') > -1) {
            browseUrl = link.href
            return true
          }
          return false
        })

        updatedGranule.browse_url = browseUrl
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
