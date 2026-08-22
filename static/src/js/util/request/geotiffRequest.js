import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import Request from './request'

/**
 * Request object for NLP search requests to CMR
 * Calls CMR NLP endpoint directly
 */
export default class GeoTiffRequest extends Request {
  constructor(edlToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)
    console.log('🚀 ~ file: geotiffRequest.js:13 ~ GeoTiffRequest ~ edlToken:', edlToken)
    this.lambda = true
    if (edlToken) {
      this.authenticated = true
      this.edlToken = edlToken
    }
  }

  stream(prompt, options = {}) {
    const query = encodeURIComponent(prompt || '')
    console.log('🚀 ~ file: geotiffRequest.js:15 ~ GeoTiffRequest ~ query:', query)

    return super.stream(`/geotiffStream?query=${query}`, options)
  }
}
