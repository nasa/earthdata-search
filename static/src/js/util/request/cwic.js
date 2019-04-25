import pick from 'lodash/pick'
import snakeCaseKeys from 'snakecase-keys'
import { parse as parseXml } from 'fast-xml-parser'
import Request from './request'


export default class CwicGranuleRequest extends Request {
  baseUrl() {
    return 'http://localhost:3001'
  }

  permittedCmrKeys() {
    return [
      'bounding_box',
      'echo_collection_id',
      'point',
      'temporal'
    ]
  }

  nonIndexedKeys() {
    return []
  }

  transformRequest(data) {
    // Converts javascript compliant keys to snake cased keys for use
    // in URLs and request payloads
    const snakeKeyData = snakeCaseKeys(data)

    // Prevent keys that our external services don't support from being sent
    const filteredData = pick(snakeKeyData, this.permittedCmrKeys())

    // CWIC does not support CORS so all of our requests will need to go through
    // Lambda. POST requests to Lambda use a JSON string
    return JSON.stringify(filteredData)
  }

  transformResponse(data) {
    const formattedResponse = parseXml(data, { ignoreAttributes: false, attributeNamePrefix: '' })

    const { feed = {} } = formattedResponse
    const { entry = [] } = feed

    entry.map((granule) => {
      const updatedGranule = granule

      updatedGranule.is_cwic = true

      const [timeStart, timeEnd] = granule['dc:date'].split('/')
      updatedGranule.time_start = timeStart
      updatedGranule.time_end = timeEnd

      // Both keys are the same format
      updatedGranule.boxes = [
        granule['georss:box']
      ]

      // Default `browse_flag` to false
      updatedGranule.browse_flag = false

      granule.link.forEach((link) => {
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
        entry,
        hits: feed['opensearch:totalResults']
      }
    }
  }

  search(data) {
    return super.post('cwic/granules', data)
  }
}
