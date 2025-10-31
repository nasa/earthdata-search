import axios, { AxiosError, CancelTokenSource } from 'axios'
import { v4 as uuidv4 } from 'uuid'

// @ts-expect-error Types are not defined for this module
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import type {
  CmrHeaders,
  RequestParams,
  Response
} from '../../types/sharedTypes'
import { routes } from '../../constants/routes'

const defaultTransformResponse = Array.isArray(axios.defaults.transformResponse)
  ? axios.defaults.transformResponse
  : []
const defaultTransformRequest = Array.isArray(axios.defaults.transformRequest)
  ? axios.defaults.transformRequest
  : []

/**
 * Parent class for the application API layer to communicate with external services
 */
export default class Request {
  /** If the request is for an authenticated user */
  authenticated: boolean

  /** The user's edlToken */
  edlToken: string | undefined

  /** The base URL for the request */
  baseUrl: string

  /** The cancel token for the request */
  cancelToken: CancelTokenSource

  /** The Earthdata environment */
  earthdataEnvironment: string

  /** If the request will go to one of our lambdas */
  lambda: boolean

  /** If the request is optionally authenticated, or not required to be authenticated */
  optionallyAuthenticated: boolean

  /** The path to the search endpoint */
  searchPath: string

  /** The start time of the request */
  startTime: number | null

  /** The request ID for the request */
  requestId: string | undefined

  /** The full URL for the request */
  fullUrl: string | undefined

  constructor(baseUrl: string, earthdataEnvironment: string) {
    if (!baseUrl) {
      throw new Error('A baseUrl must be provided.')
    }

    this.authenticated = false
    this.baseUrl = baseUrl
    this.cancelToken = axios.CancelToken.source()
    this.earthdataEnvironment = earthdataEnvironment
    this.lambda = false
    this.optionallyAuthenticated = false
    this.searchPath = ''
    this.startTime = null

    this.generateRequestId()
  }

  /**
   * Getter for the edlToken. Returns an empty string if the request is optionallyAuthenticated
   */
  getEdlToken() {
    if (this.optionallyAuthenticated && !this.edlToken) {
      return ''
    }

    return this.edlToken
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
  filterData(data: RequestParams) {
    return data
  }

  /**
   * Transforms data before sending it as a payload to an HTTP endpoint
   * @param {Object} data - An object representing an HTTP request payload
   */
  transformData(data: RequestParams) {
    return data
  }

  /**
   * Modifies the payload just before the request is sent.
   * @param {Object} data - An object representing an HTTP request payload.
   * @return {Object} A modified object.
   */
  transformRequest(data: RequestParams, headers: CmrHeaders) {
    // Filter out an unwanted data
    const filteredData = this.filterData(data)

    if (this.authenticated || this.optionallyAuthenticated) {
      // eslint-disable-next-line no-param-reassign
      headers.Authorization = `Bearer ${this.getEdlToken()}`
    }

    if (data) {
      // POST requests to Lambda use a JSON string
      if (this.lambda) {
        return JSON.stringify({
          params: filteredData,
          requestId: this.requestId
        })
      }

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
  transformResponse(data: Response) {
    const timing = Date.now() - this.startTime!

    const { dataLayer = [] } = window

    dataLayer.push({
      event: 'timing',
      timingEventCategory: 'ajax',
      timingEventVar: this.fullUrl,
      timingEventValue: timing
    })

    return data
  }

  /**
   * Makes a POST request to the provided URL.
   * @param {String} url - URL to send the provided data to.
   * @param {Object} data - Data to be sent with the request.
   * @return {Promise} A Promise object representing the request that was made
   */
  post(url: string, data: RequestParams) {
    this.startTimer()
    this.setFullUrl(url)

    const axiosObject = axios({
      method: 'post',
      baseURL: this.baseUrl,
      url,
      data,
      transformRequest: [
        (requestData, headers) => this.transformRequest(requestData, headers),
        ...defaultTransformRequest
      ],
      transformResponse: defaultTransformResponse.concat(
        (responseData: Response) => this.transformResponse(responseData)
      ),
      cancelToken: this.cancelToken.token
    })

    axiosObject.catch((error) => {
      this.handleUnauthorized(error)
    })

    return axiosObject
  }

  /**
   * Makes a GET request to the provided URL
   * @param {String} url URL to send the request to
   * @param {Object} params URL parameters
   * @return {Promise} A Promise object representing the request that was made
   */
  get(url: string, params?: RequestParams) {
    this.startTimer()
    this.setFullUrl(url)

    let requestOptions = {
      method: 'get',
      baseURL: this.baseUrl,
      url,
      params,
      transformResponse: defaultTransformResponse.concat(
        (data: Response) => this.transformResponse(data)
      ),
      cancelToken: this.cancelToken.token,
      headers: {}
    }

    // TransformRequest which adds authentication headers is only
    // applicable for request methods 'PUT', 'POST', and 'PATCH'
    if (this.authenticated) {
      requestOptions = {
        ...requestOptions,
        headers: {
          Authorization: `Bearer ${this.getEdlToken()}`
        }
      }
    }

    if (
      this.earthdataEnvironment
      && (this.lambda)
    ) {
      requestOptions = {
        ...requestOptions,
        headers: {
          ...requestOptions.headers,
          'Earthdata-ENV': this.earthdataEnvironment
        }
      }
    }

    const axiosObject = axios(requestOptions)

    axiosObject.catch((error) => {
      this.handleUnauthorized(error)
    })

    return axiosObject
  }

  /**
   * Makes a DELETE request to the provided url
   * @param {url} url URL to send the request to
   */
  delete(url: string) {
    this.startTimer()
    this.setFullUrl(url)

    let requestOptions = {
      method: 'delete',
      baseURL: this.baseUrl,
      url,
      transformResponse: defaultTransformResponse.concat(
        (data: Response) => this.transformResponse(data)
      ),
      headers: {}
    }

    // TransformRequest which adds authentication headers is only
    // applicable for request methods 'PUT', 'POST', and 'PATCH'
    if (this.authenticated) {
      requestOptions = {
        ...requestOptions,
        headers: {
          Authorization: `Bearer ${this.getEdlToken()}`
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

    const axiosObject = axios(requestOptions)

    axiosObject.catch((error) => {
      this.handleUnauthorized(error)
    })

    return axiosObject
  }

  /*
   * Makes a POST request to this.searchPath
   */
  search(params: RequestParams) {
    // We pass the ext here as a param so we can intercept and send to lambda.
    // Unauthenticated requests will ignore this key.
    return this.post(this.searchPath, params)
  }

  /**
   * Handle an unauthorized response
   */
  handleUnauthorized(error: AxiosError) {
    if ((error.response && error.response.status === 401) || error.message === 'Unauthorized') {
      const { href, pathname } = window.location
      // Determine the path to redirect to for logging in
      const returnPath = href

      if (pathname.startsWith(routes.ADMIN)) {
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

  setFullUrl(url: string) {
    this.fullUrl = `${this.baseUrl}/${url}`
  }
}
