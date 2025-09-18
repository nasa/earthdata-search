import type { Point, SpatialCoordinates } from '../../types/sharedTypes'

/**
 * Recursively removes altitude (3rd value) from spatial coordinates. Input can be a Point, MultiPoint,
 * Line, MultiLine, Polygon, or MultiPolygon.
 */
const removeAltitudeFromSpatial = (spatial: SpatialCoordinates): SpatialCoordinates => {
  if (!spatial) return spatial

  // If the first value in coordinates is a number, return only the first two elements (longitude and latitude)
  if (typeof spatial[0] === 'number') {
    const [lon, lat] = spatial as Point

    return [lon ?? 0, lat ?? 0]
  }

  // Recursively remove altitude from nested coordinates
  return spatial.map(
    (coordinate) => removeAltitudeFromSpatial(coordinate as SpatialCoordinates)
  ) as SpatialCoordinates
}

export default removeAltitudeFromSpatial
