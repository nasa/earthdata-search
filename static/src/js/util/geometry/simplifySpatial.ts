import { simplify as turfSimplify } from '@turf/turf'
import type { Geometry, Position } from 'geojson'

import { MAX_POLYGON_SIZE } from '../../constants/spatialConstants'

type CoordinateStructure = Position | Position[] | Position[][] | Position[][][]

/**
 * Get approximate coordinate count for geometry validation
 */
export const getCoordinateCount = (geometry: Geometry | null | undefined): number => {
  if (!geometry || geometry.type === 'GeometryCollection') return 0

  const geomWithCoords = geometry as Exclude<Geometry, { type: 'GeometryCollection' }>
  if (!geomWithCoords.coordinates) return 0

  // Simple flattening approach - count all coordinate arrays
  const flattenCoords = (coords: CoordinateStructure): number => {
    if (!Array.isArray(coords)) return 0
    if (typeof coords[0] === 'number') return 1

    return (coords as CoordinateStructure[]).reduce(
      (sum: number, coord: CoordinateStructure) => sum + flattenCoords(coord),
      0
    )
  }

  return flattenCoords(geomWithCoords.coordinates)
}

/**
 * Simplify spatial geometry if it exceeds size limits
 */
export const simplifySpatialGeometry = (geometry: Geometry): Geometry => {
  if (!geometry || !geometry.type) return geometry
  if (geometry.type === 'Point' || geometry.type === 'MultiPoint') return geometry

  const inputCount = getCoordinateCount(geometry)
  if (inputCount <= MAX_POLYGON_SIZE) return geometry

  try {
    const simplified = turfSimplify(geometry, {
      tolerance: 0.01,
      highQuality: true
    }) as Geometry

    return simplified || geometry
  } catch {
    return geometry
  }
}

export default simplifySpatialGeometry
