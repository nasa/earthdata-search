import axios from 'axios'

import CmrRequest from './cmrRequest'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { transformCollectionEntries } from '../collections/transformCollectionEntries'
import simplifySpatial from '../geometry/simplifySpatial'

/**
 * Request object for NLP search requests to CMR
 * Calls CMR NLP endpoint directly
 */
export default class NlpSearchRequest extends CmrRequest {
  constructor(earthdataEnvironment) {
    super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

    this.searchPath = 'search/nlp/query.json'
  }

  /**
   * Override get method to bypass Request transform hooks and preflight
   */
  get(url, params) {
    this.startTimer()
    this.setFullUrl(url)

    const requestOptions = {
      method: 'get',
      baseURL: this.baseUrl,
      url,
      params,
      transformResponse: axios.defaults.transformResponse.concat(
        (data) => this.transformResponse({ data }, params && params.q)
      ),
      cancelToken: this.cancelToken.token
    }

    return axios(requestOptions)
  }

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
   * @return {Array} Array of permitted CMR keys for NLP search
   */
  permittedCmrKeys() {
    return [
      'q'
    ]
  }

  /**
   * Transforms the NLP search response to extract and format spatial/temporal data
   * @param {Object} response - The raw NLP API response
   * @param {String} query - The original search query string
   */
  transformResponse(response, query) {
    const { data } = response
    const actualData = data?.data || data

    if (!actualData || !actualData.queryInfo) {
      return {
        queryInfo: {
          query,
          spatial: null,
          temporal: null
        },
        collections: []
      }
    }

    let spatialData = null
    let geoLocation = null
    let temporalData = null
    let collectionsData = []

    if (actualData.queryInfo.spatial) {
      const rawSpatialData = actualData.queryInfo.spatial
      const actualGeometry = rawSpatialData.geoJson || rawSpatialData
      const simplifiedGeometry = (actualGeometry && actualGeometry.type)
        ? simplifySpatial(actualGeometry)
        : null

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

    // Transform metadata entries into collection items
    const meta = data?.metadata || data?.data?.metadata
    const entries = meta?.feed?.entry
    collectionsData = transformCollectionEntries(entries, this.earthdataEnvironment)

    return {
      queryInfo: {
        query,
        spatial: spatialData ? {
          geoJson: spatialData,
          geoLocation: geoLocation || ''
        } : null,
        temporal: temporalData
      },
      collections: collectionsData
    }
  }
}
