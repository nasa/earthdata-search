import pick from 'lodash/pick'
import snakeCaseKeys from 'snakecase-keys'

import { prepKeysForCmr } from '../url/url'
import Request from './request'

/**
 * Top level CMR request object that contains all the most generic transformations and settings
 */
export default class CmrRequest extends Request {
  /**
   * Constructor.
   */
  constructor() {
    super('https://cmr.earthdata.nasa.gov')
  }

  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys() {
    return []
  }

  /**
   * Defines the default array keys that should exclude their index when stringified.
   * @return {Array} An empty array
   */
  nonIndexedKeys() {
    return []
  }

  /**
   * Select only permitted keys and transform them to meet the requirements of CMR.
   * @param {Object} data - An object containing any keys.
   * @return {Object} An object containing only the desired keys.
   */
  transformRequest(data) {
    const cmrData = super.transformRequest(data)

    // Converts javascript compliant keys to snake cased keys for use
    // in URLs and request payloads
    const snakeKeyData = snakeCaseKeys(cmrData)

    // Prevent keys that our external services don't support from being sent
    const filteredData = pick(snakeKeyData, this.permittedCmrKeys())

    const result = prepKeysForCmr(filteredData, this.nonIndexedKeys())

    return result
  }
}
