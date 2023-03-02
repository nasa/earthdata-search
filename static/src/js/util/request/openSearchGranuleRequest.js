import { XMLParser } from 'fast-xml-parser'
import { isEmpty, isString } from 'lodash'

import Request from './request'

import { getTemporal } from '../edscDate'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class OpenSearchGranuleRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true

    this.xmlParser = new XMLParser({
      attributeNamePrefix: '',
      ignoreAttributes: false,
      removeNSPrefix: true
    })

    if (authToken && authToken !== '') {
      this.authenticated = true
      this.authToken = authToken
    } else {
      this.optionallyAuthenticated = true
    }

    this.searchPath = 'opensearch/granules'
  }

  /**
   * Checks if the provided link is an image
   * @param {String} link Link
   * @return {Boolean}
   */
  isImageLink(link) {
    return !!link.match(/\.(?:gif|jpg|jpeg|png)(?:\?|#|$)/)
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the CWIC.
   * @return {Object} The transformed response
   */
  transformResponse(data) {
    try {
      const { errors = [] } = data
      if (!isEmpty(errors)) {
        return data
      }

      const formattedResponse = this.xmlParser.parse(data)

      // CWIC provides a completely different response format when a 4XX error is thrown
      // so we handle that format and response here
      const { feed = {}, OpenSearchDescription: errorBody = {} } = formattedResponse

      const {
        entry = [],
        totalResults
      } = feed

      // If the element has a `type` attribute of 'text' the XML parser interprets these
      // two elements as an object, where the value is found within the `#text` key of the object
      // so we use let here in the event that we need to override the values
      let {
        subtitle,
        title
      } = feed

      if (subtitle) {
        if (typeof subtitle === 'object' && subtitle !== null) {
          const { '#text': text } = subtitle

          subtitle = text
        }

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

      if (title) {
        if (typeof title === 'object' && title !== null) {
          const { '#text': text } = title

          title = text
        }
      }

      // Parse out the slightly different body of the response for 5XX responses
      if (title === 'CWIC OpenSearch Exception') {
        return {
          errors: [
            subtitle['#text']
          ]
        }
      }

      const granuleResults = [].concat(entry)

      granuleResults.map((granule) => {
        // Sometimes parseXml is returning a granule as "" when there should be no data.
        // Return undefined if granule doesn't exist then filter granuleResults below
        if (!granule) return undefined

        const updatedGranule = granule

        updatedGranule.isOpenSearch = true

        const {
          box: boundingBox,
          date: temporal,
          id,
          summary,
          title,
          updated
        } = granule

        // Some endpoints provide a string and some provide a number, the front end expects a string
        if (id) {
          updatedGranule.id = id.toString()
        }

        let formattedTemporal = []

        if (temporal) {
          const [timeStart, timeEnd] = temporal.split('/')
          updatedGranule.time_start = timeStart
          updatedGranule.time_end = timeEnd

          formattedTemporal = getTemporal(updatedGranule.time_start, updatedGranule.time_end)
        }

        // OpenSearch doesn't require that temporal data reside in time start/end, some endpoints
        // put the value within `updated` -- when that is the case we'll assume its the start date
        if (!temporal && updated) {
          updatedGranule.time_start = updated

          formattedTemporal = getTemporal(updatedGranule.time_start)
        }

        if (formattedTemporal.filter(Boolean).length > 0) {
          updatedGranule.formatted_temporal = formattedTemporal
        }

        if (boundingBox) {
          // Both keys are the same format
          updatedGranule.boxes = [
            boundingBox
          ]
        }

        if (summary) {
          if (typeof summary === 'object' && summary !== null) {
            const { '#text': text } = summary

            updatedGranule.summary = text
          }
        }

        if (title) {
          if (typeof title === 'object' && title !== null) {
            const { '#text': text } = title

            updatedGranule.title = text
          }
        }

        // Default `browse_flag` to false
        updatedGranule.browse_flag = false

        const granuleLinks = [].concat(granule.link)

        let browseUrl

        granuleLinks.filter(Boolean).forEach((link) => {
          if (isString(link)) {
            if (this.isImageLink(link)) {
              browseUrl = link
            }
          } else {
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
            if (!browseUrl && link.rel !== 'icon' && this.isImageLink(link.href)) {
              browseUrl = link.href
            }
          }

          updatedGranule.browse_url = browseUrl
        })

        return updatedGranule
      })

      return {
        feed: {
          entry: granuleResults.filter(Boolean),
          hits: totalResults
        }
      }
    } catch (e) {
      const { errors = [] } = data
      if (errors.length > 0) {
        return data
      }

      return {
        errors: [e]
      }
    }
  }
}
