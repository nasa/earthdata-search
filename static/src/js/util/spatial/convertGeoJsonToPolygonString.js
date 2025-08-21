import { simplifyGeoJsonPolygon } from './simplifyGeoJsonPolygon'

/**
 * Converts GeoJSON polygon coordinates to the polygon string format expected by the application
 * @param {Object} geoJsonSpatial - The spatial object from NLP response
 * @param {string} geoJsonSpatial.type - The geometry type (should be "Polygon")
 * @param {Array<Array<Array<number>>>} geoJsonSpatial.coordinates - GeoJSON polygon coordinates [[[lng, lat], ...]]
 * @returns {Object|null} - Object containing polygon string and simplification status, or null if invalid
 * @returns {string|null} returns.polygonString - Comma-separated coordinate string "lng,lat,lng,lat,..." or null if invalid
 * @returns {boolean} returns.wasSimplified - Whether the polygon was simplified due to too many points
 */
export const convertGeoJsonToPolygonString = (geoJsonSpatial) => {
  if (!geoJsonSpatial || geoJsonSpatial.type !== 'Polygon' || !geoJsonSpatial.coordinates) {
    return null
  }

  try {
    // First, simplify the polygon if it has too many points
    const { geometry: simplifiedGeometry, wasSimplified } = simplifyGeoJsonPolygon(geoJsonSpatial)

    if (!simplifiedGeometry) {
      return null
    }

    // GeoJSON polygon coordinates are nested: [[[lng, lat], [lng, lat], ...]]
    // We need the outer ring (first array in coordinates)
    const outerRing = simplifiedGeometry.coordinates[0]

    if (!Array.isArray(outerRing) || outerRing.length === 0) {
      return null
    }

    // Convert coordinate pairs to comma-separated string
    // [[lng, lat], [lng, lat], ...] -> "lng,lat,lng,lat,..."
    const coordinateString = outerRing
      .map(([lng, lat]) => `${lng},${lat}`)
      .join(',')

    return {
      polygonString: coordinateString,
      wasSimplified
    }
  } catch (error) {
    console.error('Error converting GeoJSON to polygon string:', error)

    return null
  }
}

export default convertGeoJsonToPolygonString
