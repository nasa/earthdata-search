import axios, { CancelToken } from 'axios'
import pick from 'lodash/pick'
import snakeCaseKeys from 'snakecase-keys'

import configureStore from '../../store/configureStore'
import { metricsTiming } from '../../middleware/metrics/actions'
import { prepKeysForCmr } from '../url/url'
import { getEnvironmentConfig, getClientId } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

const store = configureStore()

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
    this.startTime = null
    this.source = CancelToken.source()
  }

  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  cancel() {
    console.warn('cancelling the request')
    this.source.cancel()
  }

  /**
   * Return the cancel token so actions can cancel pending requests
   */
  cancelToken() {
    return this.source
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
      const snakeKeyData = snakeCaseKeys(data, {
        exclude: [
          /edsc\.extra\.serverless/,
          'rawModel',
          'isValid'
        ]
      })

      const { ext } = data

      // Prevent keys that our external services don't support from being sent
      const filteredData = pick(snakeKeyData, this.permittedCmrKeys(ext))

      // POST requests to Lambda use a JSON string
      if (this.authenticated || this.lambda) return JSON.stringify({ params: filteredData, ext })

      // Add the Client-Id header for requests directly to CMR
      // eslint-disable-next-line no-param-reassign
      headers['Client-Id'] = getClientId().client

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
    const timing = Date.now() - this.startTime
    store.dispatch(metricsTiming({
      url: this.fullUrl,
      timing
    }))

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
    this.startTimer()
    this.setFullUrl(url)

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
      ),
      cancelToken: this.source.token
    })
  }

  /**
   * Makes a GET request to the provided URL
   * @param {String} url URL to send the request to
   * @param {Object} params URL parameters
   * @return {Promise} A Promise object representing the request that was made
   */
  get(url, params) {
    this.startTimer()
    this.setFullUrl(url)

    let requestOptions = {
      method: 'get',
      baseURL: this.baseUrl,
      url,
      params,
      transformResponse: axios.defaults.transformResponse.concat(
        (data, headers) => this.transformResponse(data, headers)
      ),
      cancelToken: this.source.token
    }

    // transformRequest which adds authentication headers is only
    // applicable for request methods 'PUT', 'POST', and 'PATCH'
    if (this.authenticated) {
      requestOptions = {
        ...requestOptions,
        headers: {
          Authorization: `Bearer: ${this.authToken}`
        }
      }
    }

    return axios(requestOptions)
  }

  /**
   * Makes a DELETE request to the provided url
   * @param {url} url URL to send the request to
   */
  delete(url) {
    this.startTimer()
    this.setFullUrl(url)

    let requestOptions = {
      method: 'delete',
      baseURL: this.baseUrl,
      url,
      transformResponse: axios.defaults.transformResponse.concat(
        (data, headers) => this.transformResponse(data, headers)
      )
    }

    // transformRequest which adds authentication headers is only
    // applicable for request methods 'PUT', 'POST', and 'PATCH'
    if (this.authenticated) {
      requestOptions = {
        ...requestOptions,
        headers: {
          Authorization: `Bearer: ${this.authToken}`
        }
      }
    }

    return axios(requestOptions)
  }

  /*
   * Makes a POST request to this.searchPath
   */
  search(params) {
    // We pass the ext here as a param so we can intercept and send to lambda.
    // Unauthenticated requests will ignore this key.
    return this.post(this.searchPath, params)
  }

  /**
   * Handle an unauthorized response
   */
  handleUnauthorized(data) {
    const cmrEnvironment = cmrEnv()
    if (data.statusCode === 401 || data.message === 'Unauthorized') {
      // Determine the path to redirect to for logging in
      const returnPath = window.location.href
      const redirectPath = `${getEnvironmentConfig().apiHost}/login?cmr_env=${cmrEnvironment}&state=${encodeURIComponent(returnPath)}`

      window.location.href = redirectPath
    }
  }

  startTimer() {
    this.startTime = Date.now()
  }

  setFullUrl(url) {
    this.fullUrl = `${this.baseUrl}/${url}`
  }
}
