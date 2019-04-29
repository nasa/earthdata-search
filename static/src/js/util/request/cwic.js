import { parse as parseXml } from 'fast-xml-parser'
import LambdaRequest from './lambda'


export default class CwicGranuleRequest extends LambdaRequest {
  permittedCmrKeys() {
    return [
      'bounding_box',
      'echo_collection_id',
      'point',
      'temporal'
    ]
  }

  transformResponse(data) {
    const formattedResponse = parseXml(data, { ignoreAttributes: false, attributeNamePrefix: '' })

    const { feed = {} } = formattedResponse
    const { entry = [] } = feed

    const granuleReults = [].concat(entry)

    granuleReults.map((granule) => {
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
        entry: granuleReults,
        hits: feed['opensearch:totalResults']
      }
    }
  }

  /*
   * Makes a POST request to Lambda
   */
  search(data) {
    return super.post('cwic/granules', data)
  }
}
