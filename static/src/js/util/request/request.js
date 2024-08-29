import axios, { CancelToken } from 'axios'
import { v4 as uuidv4 } from 'uuid'

import configureStore from '../../store/configureStore'
import { metricsTiming } from '../../middleware/metrics/actions'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

const store = configureStore()

/**
 * Parent class for the application API layer to communicate with external services
 */
export default class Request {
  constructor(baseUrl, earthdataEnvironment) {
    if (!baseUrl) {
      throw new Error('A baseUrl must be provided.')
    }

    this.authenticated = false
    this.baseUrl = baseUrl
    this.cancelToken = CancelToken.source()
    this.earthdataEnvironment = earthdataEnvironment
    this.lambda = false
    this.optionallyAuthenticated = false
    this.searchPath = ''
    this.startTime = null

    this.generateRequestId()
  }

  /**
   * Getter for the authToken. Returns an empty string if the request is optionallyAuthenticated
   */
  getAuthToken() {
    if (this.optionallyAuthenticated && !this.authToken) {
      return ''
    }

    return this.authToken
  }

  /**
   * Return the cancel token so actions can cancel pending requests
   * @return {Object} The cancelToken source
   */
  getCancelToken() {
    return this.cancelToken
  }

  /**
   * Filter out any unwanted or non-permitted data
   * @param {Objet} data - An object representing an HTTP request payload
   */
  filterData(data) {
    return data
  }

  /**
   * Transforms data before sending it as a payload to an HTTP endpoint
   * @param {Object} data - An object representing an HTTP request payload
   */
  transformData(data) {
    console.log('🚀 ~ file: request.js:63 ~ Request ~ transformData ~ data:', data)

    return data
  }

  /**
   * Modifies the payload just before the request is sent.
   * @param {Object} data - An object representing an HTTP request payload.
   * @return {Object} A modified object.
   */
  transformRequest(data, headers) {
    // Filter out an unwanted data
    const filteredData = this.filterData(data)

    if (
      this.earthdataEnvironment
      && (this.authenticated || this.optionallyAuthenticated || this.lambda)
    ) {
      console.log('🚀 ~ file: request.js:104 ~ Request ~ transformRequest ~ this.lambda:', this.lambda)

      // eslint-disable-next-line no-param-reassign
      headers['Earthdata-ENV'] = this.earthdataEnvironment
    }

    if (this.authenticated || this.optionallyAuthenticated) {
      console.log(' second if sattement')
      // eslint-disable-next-line no-param-reassign
      headers.Authorization = `Bearer ${this.getAuthToken()}`
    }

    if (data) {
      // POST requests to Lambda use a JSON string
      if (this.authenticated || this.lambda) {
        return JSON.stringify({
          params: filteredData,
          requestId: this.requestId
        })
      }

      console.log(' third if sattement')

      // Transform the provided data before we send it to it's endpoint
      return this.transformData(filteredData)
    }

    return null
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the request.
   * @return {Object} The transformed response.
   */
  transformResponse(data) {
    // Const timing = Date.now() - this.startTime
    // store.dispatch(metricsTiming({
    //   url: this.fullUrl,
    //   timing
    // }))

    const { href, pathname } = window.location
    console.log('🚀 ~ file: request.js:124 ~ Request ~ transformResponse ~ pathname:', pathname)
    console.log('🚀 ~ file: request.js:123 ~ Request ~ transformResponse ~ href:', href)

    this.handleUnauthorized(data, href)

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
    console.log('🚀 ~ file: request.js:145 ~ Request ~ post ~ this.baseUrl:', this.baseUrl)
    console.log('🚀 ~ file: request.js:146 ~ Request ~ post ~ url:', url)

    return axios({
      method: 'post',
      baseURL: this.baseUrl,
      url,
      data,
      transformRequest: [
        (requestData, headers) => this.transformRequest(requestData, headers),
        ...axios.defaults.transformRequest
      ],
      transformResponse: axios.defaults.transformResponse.concat(
        (responseData, headers) => this.transformResponse(responseData, headers)
      ),
      cancelToken: this.cancelToken.token
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
      cancelToken: this.cancelToken.token
    }

    // TransformRequest which adds authentication headers is only
    // applicable for request methods 'PUT', 'POST', and 'PATCH'
    if (this.authenticated) {
      requestOptions = {
        ...requestOptions,
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`
        }
      }
    }

    if (
      this.earthdataEnvironment
      && (this.authenticated || this.optionallyAuthenticated || this.lambda)
    ) {
      requestOptions = {
        ...requestOptions,
        headers: {
          ...requestOptions.headers,
          'Earthdata-ENV': this.earthdataEnvironment
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

    // TransformRequest which adds authentication headers is only
    // applicable for request methods 'PUT', 'POST', and 'PATCH'
    if (this.authenticated) {
      requestOptions = {
        ...requestOptions,
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`
        }
      }
    }

    if (
      this.earthdataEnvironment
      && (this.authenticated || this.optionallyAuthenticated || this.lambda)
    ) {
      requestOptions = {
        ...requestOptions,
        headers: {
          ...requestOptions.headers,
          'Earthdata-ENV': this.earthdataEnvironment
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
  handleUnauthorized(data, hrefRight) {
    console.log('🚀 ~ file: request.js:265 ~ Request ~ handleUnauthorized ~ hrefRight:', hrefRight)
    if (data.statusCode === 401 || data.message === 'Unauthorized') {
      const { pathname } = window.location
      console.log('🚀 ~ file: request.js:267 ~ Request ~ handleUnauthorized ~ pathname:', pathname)
      // Determine the path to redirect to for logging in
      const returnPath = hrefRight

      if (pathname.startsWith('/admin')) {
        window.location.href = getEnvironmentConfig().edscHost

        return
      }

      const redirectPath = `${getEnvironmentConfig().apiHost}/login?ee=${this.earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`

      window.location.href = redirectPath
    }
  }

  generateRequestId() {
    this.requestId = uuidv4()
  }

  startTimer() {
    this.startTime = Date.now()
  }

  setFullUrl(url) {
    this.fullUrl = `${this.baseUrl}/${url}`
  }
}
