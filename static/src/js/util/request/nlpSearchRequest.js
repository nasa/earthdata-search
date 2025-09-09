import axios from 'axios'
import { pick } from 'lodash-es'
import simplifySpatialGeometry from '../geometry/simplifySpatial'

import CmrRequest from './cmrRequest'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Simplifies NLP geometry if it has too many points using Turf.js
 * @param {Object | null} geometry - GeoJSON geometry object to simplify
 * @returns {Object | null} Simplified geometry or null if simplification failed
 */
const simplifyNlpGeometry = (geometry) => {
  if (!geometry || !geometry.type) return null
  if (geometry.type === 'Point') return geometry

  return simplifySpatialGeometry(geometry)
}

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
   * Override get method to make a simple request
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
   * NLP API expects camelCase parameters, unlike standard CMR endpoints
   * @return {Array} Array of permitted CMR keys for NLP search
   */
  permittedCmrKeys() {
    return [
      'q',
      'pageNum',
      'pageSize'
    ]
  }

  /**
   * Transforms the NLP search response to extract and format spatial/temporal data
   * @param {Object} response - The raw NLP API response
   * @param {String} query - The original search query string
   * @returns {Object} Transformed data with query, spatial, and temporal properties
   */
  transformResponse(response, query) {
    const { data } = response
    const actualData = data?.data || data

    if (!actualData || !actualData.queryInfo) {
      return {
        query,
        spatial: null,
        geoLocation: null,
        temporal: null
      }
    }

    let spatialData = null
    let geoLocation = null
    let temporalData = null

    if (actualData.queryInfo.spatial) {
      const rawSpatialData = actualData.queryInfo.spatial
      const actualGeometry = rawSpatialData.geoJson || rawSpatialData
      const simplifiedGeometry = simplifyNlpGeometry(actualGeometry)

      if (simplifiedGeometry) {
        spatialData = simplifiedGeometry
      }

      geoLocation = rawSpatialData.geoLocation || null
    }

    if (actualData.queryInfo.temporal) {
      const { startDate, endDate } = actualData.queryInfo.temporal
      if (startDate || endDate) {
        temporalData = {
          startDate: startDate ? new Date(startDate).toISOString() : '',
          endDate: endDate ? new Date(endDate).toISOString() : ''
        }
      }
    }

    return {
      query,
      spatial: spatialData ? {
        geoJson: spatialData,
        geoLocation
      } : null,
      temporal: temporalData
    }
  }
}
