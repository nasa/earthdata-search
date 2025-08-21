import { simplifyPolygonCoordinates } from './simplifyPolygonCoordinates'

/**
 * Simplifies a GeoJSON polygon if it has too many points
 * @param {Object} geoJsonSpatial - The spatial object from NLP response
 * @param {string} geoJsonSpatial.type - The geometry type (should be "Polygon")
 * @param {Array<Array<Array<number>>>} geoJsonSpatial.coordinates - GeoJSON polygon coordinates [[[lng, lat], ...]]
 * @returns {Object} - Object containing simplified geometry and whether simplification occurred
 * @returns {Object|null} returns.geometry - Simplified GeoJSON geometry or null if invalid
 * @returns {boolean} returns.wasSimplified - Whether the geometry was simplified
 */
export const simplifyGeoJsonPolygon = (geoJsonSpatial) => {
  if (!geoJsonSpatial || geoJsonSpatial.type !== 'Polygon' || !geoJsonSpatial.coordinates) {
    return {
      geometry: null,
      wasSimplified: false
    }
  }

  try {
    // Get the outer ring coordinates
    const outerRing = geoJsonSpatial.coordinates[0]

    if (!Array.isArray(outerRing) || outerRing.length === 0) {
      return {
        geometry: null,
        wasSimplified: false
      }
    }

    // Use shared simplification logic
    const { coordinates, wasSimplified } = simplifyPolygonCoordinates(outerRing)

    // If no simplification was needed, return original geometry
    if (!wasSimplified) {
      return {
        geometry: geoJsonSpatial,
        wasSimplified: false
      }
    }

    // Create new GeoJSON with simplified coordinates
    const simplifiedGeometry = {
      ...geoJsonSpatial,
      coordinates: [coordinates]
    }

    return {
      geometry: simplifiedGeometry,
      wasSimplified: true
    }
  } catch (error) {
    console.error('Error simplifying GeoJSON polygon:', error)

    return {
      geometry: geoJsonSpatial,
      wasSimplified: false
    }
  }
}

export default simplifyGeoJsonPolygon
