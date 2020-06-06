import pick from 'lodash/pick'
import snakeCaseKeys from 'snakecase-keys'

import Request from './request'

import { prepKeysForCmr } from '../../../../../sharedUtils/prepKeysForCmr'

/**
 * Parent class for the application API layer to communicate with external services
 */
export default class CmrRequest extends Request {
  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys() {
    return []
  }

  /**
   * Defines the default array keys that should exclude their index when stringified.
   * @return { Array } An empty array
   */
  nonIndexedKeys() {
    return []
  }

  /**
   * Filter out any unwanted or non-permitted data
   * @param {Objet} data - An object representing an HTTP request payload
   */
  filterData(data) {
    if (data) {
      // Converts javascript compliant keys to snake cased keys for use
      // in URLs and request payloads
      const snakeKeyData = snakeCaseKeys(data, {
        exclude: [
          /edsc\.extra\.serverless/,
          'rawModel',
          'isValid'
        ]
      })

      return pick(snakeKeyData, this.permittedCmrKeys())
    }

    return data
  }

  /**
   * Transforms data before sending it as a payload to an HTTP endpoint
   * @param {Object} data - An object representing an HTTP request payload
   */
  transformData(data) {
    return prepKeysForCmr(
      super.transformData(data),
      this.nonIndexedKeys()
    )
  }
}
