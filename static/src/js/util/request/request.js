import axios from 'axios'
import pick from 'lodash/pick'
import snakeCaseKeys from 'snakecase-keys'

/**
 * Parent class for the application API layer to communicate with external services
 */
export default class Request {
  /**
   * Returns the default URL used to communicate with external APIs.
   * @return {String} The default URL our API will hit (API Gateway)
   */
  baseUrl() {
    return 'http://localhost:3001'
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
   * Makes a POST request to the provided URL.
   * @param {String} url - URL to send the provided data to.
   * @param {Object} data - Data to be sent with the request.
   * @return {Promise} A Promise object representing the reques that was made
   */
  post(url, data) {
    return axios({
      method: 'post',
      baseURL: this.baseUrl(),
      url,
      data,
      transformRequest: [
        data => this.transformRequest(data)
      ],
      transformResponse: axios.defaults.transformResponse.concat(
        data => this.transformResponse(data)
      )
    })
  }

  /**
   * Modifies the payload just before the request is sent.
   * @param {Object} data - An object containing any keys.
   * @return {Object} A modified object.
   */
  transformRequest(data) {
    // Converts javascript compliant keys to snake cased keys for use
    // in URLs and request payloads
    const snakeKeyData = snakeCaseKeys(data)

    // Prevent keys that our external services don't support from being sent
    const filteredData = pick(snakeKeyData, this.permittedCmrKeys())

    return filteredData
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the object.
   * @return {Object} The object provided
   */
  transformResponse(data) {
    return data
  }
}
