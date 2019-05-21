import Request from './request'

import { getTemporal } from '../edsc-date'

/**
 * Request object for granule specific requests
 */
export default class GranuleRequest extends Request {
  constructor(authToken) {
    if (authToken && authToken !== '') {
      super('http://localhost:3001')

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'granules'
    } else {
      super('https://cmr.earthdata.nasa.gov')

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
      'sort_key'
    ]
  }

  nonIndexedKeys() {
    return [
      'sort_key'
    ]
  }

  transformResponse(data) {
    this.handleUnauthorized(data)

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

      const h = 85
      const w = 85

      if (granule.id) {
        // eslint-disable-next-line
        updatedGranule.thumbnail = `${this.baseUrl}/browse-scaler/browse_images/granules/${granule.id}?h=${h}&w=${w}`
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
