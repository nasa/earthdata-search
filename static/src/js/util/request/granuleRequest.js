import CmrRequest from './cmrRequest'
import {
  getApplicationConfig,
  getEarthdataConfig,
  getEnvironmentConfig
} from '../../../../../sharedUtils/config'
import { granuleRequestNonIndexedCmrKeys } from '../../../../../sharedConstants/nonIndexedCmrKeys'
import { granuleRequestPermittedCmrKeys } from '../../../../../sharedConstants/permittedCmrKeys'

import { getTemporal } from '../../../../../sharedUtils/edscDate'

import normalizeGranuleSpatial from '../map/normalizeGranuleSpatial'

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

    const { earthdataEnvironment } = this

    // If the response status code is not 200, return unaltered data
    // If the status code is 200, it doesn't exist in the response
    const { statusCode = 200 } = data
    if (statusCode !== 200) return data

    const { feed = {} } = data
    const { entry = [] } = feed

    entry.map((granule) => {
      const {
        id,
        time_start: timeStart,
        time_end: timeEnd,
        links
      } = granule

      const updatedGranule = granule

      updatedGranule.isOpenSearch = false

      const formattedTemporal = getTemporal(timeStart, timeEnd)

      if (formattedTemporal.filter(Boolean).length > 0) {
        updatedGranule.formatted_temporal = formattedTemporal
      }

      const { thumbnailSize } = getApplicationConfig()
      const { height, width } = thumbnailSize

      if (id) {
        // Retrieve collection thumbnail if it exists
        updatedGranule.thumbnail = `${getEnvironmentConfig().apiHost}/scale/granules/${id}?h=${height}&w=${width}&ee=${earthdataEnvironment}`
      }

      if (links && links.length > 0) {
        let browseUrl

        // Pick the first 'browse' link to use as the browseUrl
        links.some((link) => {
          const {
            href,
            rel
          } = link

          if (rel.indexOf('browse') > -1 && href.startsWith('https://')) {
            browseUrl = href

            return true
          }

          return false
        })

        updatedGranule.browse_url = browseUrl
      }

      // Create a GeoJSON representation of the granule spatial
      updatedGranule.spatial = normalizeGranuleSpatial(granule)

      return updatedGranule
    })

    return {
      feed: {
        entry
      }
    }
  }
}
