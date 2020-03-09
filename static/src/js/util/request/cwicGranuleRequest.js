import { parse as parseXml } from 'fast-xml-parser'
import Request from './request'
import { getTemporal } from '../edscDate'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class CwicGranuleRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)

    this.lambda = true

    if (authToken && authToken !== '') {
      this.authenticated = true
      this.authToken = authToken
    } else {
      this.optionallyAuthenticated = true
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
    try {
      const formattedResponse = parseXml(data, { ignoreAttributes: false, attributeNamePrefix: '' })

      // CWIC provides a completely different response format when a 4XX error is thrown
      // so we handle that format and response here
      const { feed = {}, OpenSearchDescription: errorBody = {} } = formattedResponse

      const { entry = [], subtitle } = feed

      if (subtitle) {
        const { '#text': errorAttribute } = subtitle
        const [,
          errorClass
        ] = errorAttribute.split(': ')

        return {
          errors: [
            errorClass
          ]
        }
      }

      if (errorBody.ShortName === 'Exception') {
        return {
          errors: [
            errorBody.Description
          ]
        }
      }

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

        let browseUrl

        granuleLinks.forEach((link) => {
          if (link.rel === 'icon') {
            updatedGranule.thumbnail = link.href

            // We found a suitable image, flip the flag to true
            updatedGranule.browse_flag = true
          }

          // CWIC does not have a standard link relation for large-sized browse,
          // so we look for URLs with extensions of jpg, jpeg, gif, and png, and
          // return the first one which is not marked as the icon. If there's
          // no such relation, we return nothing, which results in there being
          // no link to the full size image.
          if (!browseUrl && link.rel !== 'icon' && link.href.match(/\.(?:gif|jpg|jpeg|png)(?:\?|#|$)/)) {
            browseUrl = link.href
          }

          updatedGranule.browse_url = browseUrl
        })

        return updatedGranule
      })

      return {
        feed: {
          entry: granuleResults,
          hits: feed['opensearch:totalResults']
        }
      }
    } catch (e) {
      const { errors = [] } = data
      if (errors.length > 0) {
        return errors
      }

      return {
        erros: [e]
      }
    }
  }
}
