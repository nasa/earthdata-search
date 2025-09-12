import { simplify as turfSimplify, booleanClockwise } from '@turf/turf'
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
export const simplifySpatial = (geometry: Geometry): Geometry => {
  if (!geometry || !geometry.type) return geometry
  if (geometry.type === 'Point' || geometry.type === 'MultiPoint') return geometry

  let working: Geometry = geometry
  let count = getCoordinateCount(working)
  if (count <= MAX_POLYGON_SIZE) return working

  let tolerance = 0.001
  let previousCount = count

  // Iteratively increase tolerance until we get under threshold or no more reduction
  for (let i = 0; i < 25 && count > MAX_POLYGON_SIZE; i += 1) {
    try {
      const simplified = turfSimplify(working, {
        tolerance: tolerance += 0.002,
        highQuality: true
      }) as Geometry

      if (simplified && simplified.type === 'Polygon') {
        const poly = simplified as unknown as { coordinates: number[][][] }
        if (poly.coordinates && poly.coordinates[0] && booleanClockwise(poly.coordinates[0])) {
          poly.coordinates[0] = poly.coordinates[0].reverse()
        }
      }

      if (simplified) working = simplified

      count = getCoordinateCount(working)
      if (count === previousCount) break
      previousCount = count
    } catch {
      break
    }
  }

  return working
}

export default simplifySpatial
