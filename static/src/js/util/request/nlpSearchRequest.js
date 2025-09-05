import axios from 'axios'
import { pick } from 'lodash-es'
import { booleanClockwise, simplify } from '@turf/turf'

import CmrRequest from './cmrRequest'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { MAX_POLYGON_SIZE } from '../../constants/spatialConstants'

/**
 * Simplifies NLP geometry if it has too many points using Turf.js
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
          // Ensure clockwise winding for polygons
          if (simplified.type === 'Polygon') {
            const isClockwise = booleanClockwise(simplified.coordinates[0])

            if (!isClockwise) {
              simplified.coordinates[0] = simplified.coordinates[0].reverse()
            }
          }

          return simplified
        }

        tolerance *= 2
      } catch (error) {
        console.warn('Error simplifying geometry:', error)

        return geometry
      }
    }

    console.warn('Could not simplify geometry below max polygon size')

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

  /**
   * Transforms the NLP search response to extract and format spatial/temporal data
   * @param {Object} response - The raw NLP API response
   * @param {String} query - The original search query string
   * @returns {Object} Transformed data with query, spatial, and temporal properties
   */
  transformResponse(response, query) {
    const { data } = response

    if (!data || !data.queryInfo) {
      return {
        query,
        spatial: null,
        temporal: null
      }
    }

    let spatialData = null
    let temporalData = null

    if (data.queryInfo.spatial) {
      const rawSpatialData = data.queryInfo.spatial
      const actualGeometry = rawSpatialData.geoJson || rawSpatialData
      const simplifiedGeometry = simplifyNlpGeometry(actualGeometry)

      if (simplifiedGeometry) {
        spatialData = {
          type: 'FeatureCollection',
          name: 'NLP Extracted Spatial Area',
          features: [{
            type: 'Feature',
            properties: {
              source: 'nlp',
              query,
              edscId: '0'
            },
            geometry: simplifiedGeometry
          }]
        }
      }
    }

    if (data.queryInfo.temporal) {
      const { startDate, endDate } = data.queryInfo.temporal
      if (startDate || endDate) {
        temporalData = {
          startDate: startDate ? new Date(startDate).toISOString() : '',
          endDate: endDate ? new Date(endDate).toISOString() : ''
        }
      }
    }

    return {
      query,
      spatial: spatialData,
      temporal: temporalData
    }
  }
}
