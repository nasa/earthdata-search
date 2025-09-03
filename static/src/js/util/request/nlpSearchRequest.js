import axios from 'axios'
import { pick } from 'lodash-es'
import CmrRequest from './cmrRequest'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Request object for NLP search requests to CMR
 * Calls CMR NLP endpoint directly
 */
export default class NlpSearchRequest extends CmrRequest {
  constructor(authToken, earthdataEnvironment) {
    super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

    this.searchPath = 'search/nlp/query.json'
  }

  /**
   * Override filterData to skip snake_case conversion for NLP API
   * NLP API expects camelCase parameters, unlike traditional CMR endpoints
   * @param {Object} data - An object representing an HTTP request payload
   */
  filterData(data) {
    if (data) {
      return pick(data, this.permittedCmrKeys())
    }

    return data
  }

  /**
   * Override get method to make completely simple request (no CORS preflight)
   * @param {String} url - URL to request
   * @param {Object} params - Query parameters
   */
  get(url, params) {
    this.startTimer()
    this.setFullUrl(url)

    const requestOptions = {
      method: 'get',
      baseURL: this.baseUrl,
      url,
      params,
      cancelToken: this.cancelToken.token
    }

    return axios(requestOptions)
  }

  /**
   * Override search method for NLP calls
   * @param {Object} searchParams - Search parameters
   */
  search(searchParams) {
    return this.get(this.searchPath, searchParams)
  }

  /**
   * Defines the default array keys that should exclude their index when stringified.
   * @return {Array} An empty array
   */
  nonIndexedKeys() {
    return []
  }

  /**
   * Defines the default keys that our API endpoints allow.
   * NLP API expects camelCase parameters, unlike traditional CMR endpoints
   * @return {Array} Array of permitted CMR keys for NLP search
   */
  permittedCmrKeys() {
    return [
      'q',
      'pageNum',
      'pageSize'
    ]
  }
}
