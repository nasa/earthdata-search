import axios from 'axios'
import pick from 'lodash/pick'
import snakeCaseKeys from 'snakecase-keys'

import { prepKeysForCmr } from '../url/url'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Parent class for the application API layer to communicate with external services
 */
export default class Request {
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error('A baseUrl must be provided.')
    }

    this.authenticated = false
    this.baseUrl = baseUrl
    this.lambda = false
    this.searchPath = ''
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
   * Modifies the payload just before the request is sent.
   * @param {Object} data - An object containing any keys.
   * @return {Object} A modified object.
   */
  transformRequest(data, headers) {
    if (this.authenticated) {
      // eslint-disable-next-line no-param-reassign
      headers.Authorization = `Bearer: ${this.authToken}`
    }

    if (data) {
      // Converts javascript compliant keys to snake cased keys for use
      // in URLs and request payloads
      const snakeKeyData = snakeCaseKeys(data)

      // Prevent keys that our external services don't support from being sent
      const filteredData = pick(snakeKeyData, this.permittedCmrKeys())

      // CWIC does not support CORS so all of our requests will need to go through
      // Lambda. POST requests to Lambda use a JSON string
      if (this.authenticated || this.lambda) return JSON.stringify({ params: filteredData })
      return prepKeysForCmr(filteredData, this.nonIndexedKeys())
    }
    return null
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the request.
   * @return {Object} The transformed response.
   */
  transformResponse(data) {
    this.handleUnauthorized(data)

    return data
  }

  /**
   * Makes a POST request to the provided URL.
   * @param {String} url - URL to send the provided data to.
   * @param {Object} data - Data to be sent with the request.
   * @return {Promise} A Promise object representing the request that was made
   */
  post(url, data) {
    return axios({
      method: 'post',
      baseURL: this.baseUrl,
      url,
      data,
      transformRequest: [
        (data, headers) => this.transformRequest(data, headers)
      ],
      transformResponse: axios.defaults.transformResponse.concat(
        (data, headers) => this.transformResponse(data, headers)
      )
    })
  }

  /**
   * Makes a GET request to the provided URL
   * @param {string} url URL to send the request to
   * @return {Promise} A Promise object representing the request that was made
   */
  get(url) {
    return axios({
      method: 'get',
      baseURL: this.baseUrl,
      url,
      transformRequest: [
        (data, headers) => this.transformRequest(data, headers)
      ]
    })
  }

  /*
   * Makes a POST request to this.searchPath
   */
  search(params) {
    return this.post(this.searchPath, params)
  }

  /**
   * Handle an unauthorized response
   */
  handleUnauthorized(data) {
    if (data.statusCode === 401) {
      const returnPath = window.location.href

      window.location.href = `${getEarthdataConfig('prod').apiHost}/login?cmr_env=${'prod'}&state=${encodeURIComponent(returnPath)}`
    }
  }
}
