import { booleanClockwise, simplify } from '@turf/turf'

const MAX_POLYGON_SIZE = 50

/**
 * Simplifies polygon coordinates if they exceed the maximum point threshold
 * This is the core simplification algorithm used by both shapefile uploads and NLP spatial data
 * @param {Array<Array<number>>} coordinates - Array of coordinate pairs [[lng, lat], ...]
 * @param {Object} options - Configuration options
 * @param {number} options.maxPoints - Maximum number of points before simplification (default: 50)
 * @returns {Object} - Object containing simplified coordinates and metadata
 * @returns {Array<Array<number>>} returns.coordinates - Simplified coordinates
 * @returns {boolean} returns.wasSimplified - Whether the coordinates were simplified
 * @returns {number} returns.originalPointCount - Original number of points
 * @returns {number} returns.simplifiedPointCount - Final number of points
 */
export const simplifyPolygonCoordinates = (coordinates, options = {}) => {
  const { maxPoints = MAX_POLYGON_SIZE } = options

  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return {
      coordinates: [],
      wasSimplified: false,
      originalPointCount: 0,
      simplifiedPointCount: 0
    }
  }

  const originalPointCount = coordinates.length

  // If points are within threshold, return original coordinates
  if (originalPointCount <= maxPoints) {
    return {
      coordinates,
      wasSimplified: false,
      originalPointCount,
      simplifiedPointCount: originalPointCount
    }
  }

  try {
    // Create a GeoJSON-like structure for Turf.js
    const geoJsonLikeGeometry = {
      type: 'Polygon',
      coordinates: [coordinates]
    }

    let simplifiedGeometry = { ...geoJsonLikeGeometry }
    let currentPointCount = originalPointCount
    let tolerance = 0.001
    let previousPointCount = currentPointCount

    // Simplify until we're under the threshold or can't simplify further
    while (currentPointCount > maxPoints) {
      // Simplify the geometry using Turf.js, increasing tolerance each iteration
      const simplified = simplify(simplifiedGeometry, {
        tolerance: tolerance += 0.002,
        highQuality: true
      })

      // Ensure the simplified geometry coordinates exist
      if (!simplified.coordinates || !simplified.coordinates[0]) {
        break
      }

      // Ensure the simplified geometry is counter-clockwise
      if (booleanClockwise(simplified.coordinates[0])) {
        simplified.coordinates[0] = simplified.coordinates[0].reverse()
      }

      simplifiedGeometry = simplified
      currentPointCount = simplified.coordinates[0].length

      // If the number of points hasn't changed, break to avoid infinite loop
      if (currentPointCount === previousPointCount) {
        break
      }

      previousPointCount = currentPointCount
    }

    return {
      coordinates: simplifiedGeometry.coordinates[0],
      wasSimplified: true,
      originalPointCount,
      simplifiedPointCount: currentPointCount
    }
  } catch (error) {
    console.error('Error simplifying polygon coordinates:', error)

    return {
      coordinates,
      wasSimplified: false,
      originalPointCount,
      simplifiedPointCount: originalPointCount
    }
  }
}

export default simplifyPolygonCoordinates
