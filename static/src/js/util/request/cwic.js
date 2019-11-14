import { parse as parseXml } from 'fast-xml-parser'
import Request from './request'
import { getTemporal } from '../edscDate'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class CwicGranuleRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)

    if (authToken && authToken !== '') {
      this.authenticated = true
      this.authToken = authToken
    }

    this.searchPath = 'cwic/granules'
  }

  permittedCmrKeys() {
    return [
      'bounding_box',
      'echo_collection_id',
      'point',
      'temporal'
    ]
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the CWIC.
   * @return {Object} The transformed response
   */
  transformResponse(data) {
    const formattedResponse = parseXml(data, { ignoreAttributes: false, attributeNamePrefix: '' })

    // CWIC provides a completely different response format when a 4XX error is thrown
    // so we handle that format and response here
    const { OpenSearchDescription: errorBody = {} } = formattedResponse
    if (errorBody.ShortName === 'Exception') {
      return {
        errors: [
          errorBody.Description
        ]
      }
    }

    const { feed = {} } = formattedResponse
    const { entry = [] } = feed

    // Parse out the slightly different body of the response for 5XX responses
    if (feed.title === 'CWIC OpenSearch Exception') {
      return {
        errors: [
          feed.subtitle['#text']
        ]
      }
    }

    const granuleResults = [].concat(entry)

    granuleResults.map((granule) => {
      const updatedGranule = granule

      updatedGranule.is_cwic = true

      const [timeStart, timeEnd] = granule['dc:date'].split('/')
      updatedGranule.time_start = timeStart
      updatedGranule.time_end = timeEnd

      updatedGranule.formatted_temporal = getTemporal(timeStart, timeEnd)

      // Both keys are the same format
      updatedGranule.boxes = [
        granule['georss:box']
      ]

      // Default `browse_flag` to false
      updatedGranule.browse_flag = false

      const granuleLinks = [].concat(granule.link)

      granuleLinks.forEach((link) => {
        if (link.rel === 'icon') {
          updatedGranule.thumbnail = link.href

          // We found a suitable image, flip the flag to true
          updatedGranule.browse_flag = true
        }
      })

      return updatedGranule
    })

    return {
      feed: {
        entry: granuleResults,
        hits: feed['opensearch:totalResults']
      }
    }
  }
}
