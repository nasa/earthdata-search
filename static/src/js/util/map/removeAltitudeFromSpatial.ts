import type { Point, SpatialCoordinates } from '../../types/sharedTypes'

/**
 * Recursively removes altitude information from spatial coordinates.
 * @param coordinates The spatial coordinates which may include altitude information
 * @returns The spatial coordinates with altitude information removed
 */
const removeAltitudeFromCoordinates = (coordinates: SpatialCoordinates): SpatialCoordinates => {
  // If the first value in coordinates is a number, return only the first two elements (longitude and latitude)
  if (typeof coordinates[0] === 'number') {
    const [lon, lat] = coordinates as Point

    return [lon ?? 0, lat ?? 0]
  }

  // Recursively remove altitude from nested coordinates
  return coordinates.map(
    (coordinate) => removeAltitudeFromCoordinates(coordinate as SpatialCoordinates)
  ) as SpatialCoordinates
}

/**
 * Removes the altitude (3rd value) from spatial coordinates. Input can be a Point, MultiPoint,
 * Line, MultiLine, Polygon, or MultiPolygon.
 */
const removeAltitudeFromSpatial = (spatial: SpatialCoordinates): SpatialCoordinates => {
  if (!spatial) return spatial

  if (Array.isArray(spatial)) {
    return removeAltitudeFromCoordinates(spatial)
  }

  return spatial
}

export default removeAltitudeFromSpatial
