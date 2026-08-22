import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import Request from './request'

/**
 * Request object for NLP search requests to CMR
 * Calls CMR NLP endpoint directly
 */
export default class GeoTiffRequest extends Request {
  constructor(earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)
    this.lambda = true
  }

  stream(prompt, options = {}) {
    const query = encodeURIComponent(prompt || '')
    console.log('🚀 ~ file: geotiffRequest.js:15 ~ GeoTiffRequest ~ query:', query)

    return super.stream(`/geotiffStream?query=${query}`, options)
  }
}
