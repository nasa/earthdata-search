import axios from 'axios'
import { pick } from 'lodash-es'
import { simplify, booleanClockwise } from '@turf/turf'

import CmrRequest from './cmrRequest'
// @ts-expect-error This file does not have types
import CollectionRequest from './collectionRequest'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Simplifies NLP geometry if it has too many points
 * @param {Object | null} geometry - GeoJSON geometry object to simplify
 * @returns {Object | null} Simplified geometry or null if simplification failed
 */
const simplifyNlpGeometry = (geometry) => {
  if (!geometry || !geometry.type) {
    return null
  }

  if (geometry.type === 'Point') {
    return geometry
  }

  const coords = geometry.coordinates
  if (!coords) return geometry

  const coordsToCheck = geometry.type === 'Polygon' ? coords[0] : coords
  const coordinateCount = Array.isArray(coordsToCheck) ? coordsToCheck.length : 0

  const MAX_POLYGON_SIZE = 50
  if (coordinateCount > MAX_POLYGON_SIZE) {
    let simplified = geometry
    let tolerance = 0.001

    for (let attempts = 0; attempts < 10; attempts += 1) {
      try {
        simplified = simplify(geometry, {
          tolerance,
          highQuality: false
        })

        const simplifiedCoords = simplified.type === 'Polygon'
          ? simplified.coordinates[0]
          : simplified.coordinates
        const simplifiedCount = Array.isArray(simplifiedCoords) ? simplifiedCoords.length : 0

        if (simplifiedCount <= MAX_POLYGON_SIZE) {
          if (simplified.type === 'Polygon') {
            const isClockwise = booleanClockwise(simplified.coordinates[0])
            if (!isClockwise) {
              simplified.coordinates[0] = simplified.coordinates[0].reverse()
            }
          }

          return simplified
        }

        tolerance *= 2
      } catch {
        return geometry
      }
    }

    return geometry
  }

  return geometry
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
        (data) => ({
          raw: data,
          transformed: this.transformResponse({ data }, params && params.q)
        })
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
    let collectionsData = []

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

    // Transform metadata entries into collection items
    const meta = data?.metadata || data?.data?.metadata
    const entries = meta?.feed?.entry || []
    if (Array.isArray(entries) && entries.length) {
      const cr = new CollectionRequest('', this.earthdataEnvironment)
      const transformed = cr.transformResponse({ feed: { entry: entries } })
      collectionsData = transformed?.feed?.entry || []
    }

    return {
      query,
      spatial: spatialData,
      geoLocation,
      temporal: temporalData,
      collections: collectionsData
    }
  }
}
