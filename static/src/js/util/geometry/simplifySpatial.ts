import { booleanClockwise, simplify as turfSimplify } from '@turf/turf'
import type {
  Geometry,
  Position,
  Polygon as GJPolygon,
  MultiPolygon as GJMultiPolygon,
  LineString as GJLineString,
  MultiLineString as GJMultiLineString
} from 'geojson'

import { MAX_POLYGON_SIZE } from '../../constants/spatialConstants'

export const getCoordinateCount = (geometry: Geometry | null | undefined): number => {
  if (!geometry || !geometry.type) return 0

  switch (geometry.type) {
    case 'Polygon': {
      const rings = (geometry as GJPolygon).coordinates

      return Array.isArray(rings) && Array.isArray(rings[0]) ? rings[0].length : 0
    }

    case 'MultiPolygon': {
      const polys = (geometry as GJMultiPolygon).coordinates

      if (!Array.isArray(polys)) return 0

      return polys.reduce((sum, poly) => {
        const hasExterior = Array.isArray(poly) && Array.isArray(poly[0])

        return sum + (hasExterior ? poly[0].length : 0)
      }, 0)
    }

    case 'LineString': {
      const coords = (geometry as GJLineString).coordinates

      return Array.isArray(coords) ? coords.length : 0
    }

    case 'MultiLineString': {
      const lines = (geometry as GJMultiLineString).coordinates

      if (!Array.isArray(lines)) return 0

      return lines.reduce((sum, line) => sum + (Array.isArray(line) ? line.length : 0), 0)
    }

    default:
      return 0
  }
}

// Enforce CCW exterior/CW holes for polygons to keep orientation consistent
const normalizePolygonWinding = (geometry: Geometry): Geometry => {
  if (!geometry || !geometry.type) return geometry

  const orientRing = (ring: Position[], desired: 'ccw' | 'cw') => {
    const isClockwise = booleanClockwise(ring as [number, number][])

    let oriented = ring
    const shouldReverse = (
      (desired === 'ccw' && isClockwise)
      || (desired === 'cw' && !isClockwise)
    )

    if (shouldReverse) oriented = ring.slice().reverse()

    const first = oriented[0]
    const last = oriented[oriented.length - 1]
    const isClosed = first && last && first[0] === last[0] && first[1] === last[1]

    if (!isClosed) return oriented.concat([first])

    return oriented
  }

  if (geometry.type === 'Polygon') {
    const rings: Position[][] = (geometry as GJPolygon).coordinates || []
    const newRings = rings.map((ring: Position[], idx: number) => (
      orientRing(ring, idx === 0 ? 'ccw' : 'cw')
    ))

    return {
      type: 'Polygon',
      coordinates: newRings
    } as GJPolygon
  }

  if (geometry.type === 'MultiPolygon') {
    const polys: Position[][][] = (geometry as GJMultiPolygon).coordinates || []
    const newPolys = polys.map((poly: Position[][]) => (
      (poly || []).map((ring: Position[], idx: number) => (
        orientRing(ring, idx === 0 ? 'ccw' : 'cw')
      ))
    ))

    return {
      type: 'MultiPolygon',
      coordinates: newPolys
    } as GJMultiPolygon
  }

  return geometry
}

export const simplifySpatialGeometry = (geometry: Geometry): Geometry => {
  const initialTolerance = 0.001
  const toleranceStep = 0.002
  const maxAttempts = 10

  if (!geometry || !geometry.type) return geometry
  if (geometry.type === 'Point' || geometry.type === 'MultiPoint') return geometry

  const inputCount = getCoordinateCount(geometry)
  if (inputCount <= MAX_POLYGON_SIZE) {
    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      return normalizePolygonWinding(geometry)
    }

    return geometry
  }

  let tolerance = initialTolerance
  let previousCount = inputCount
  let lastSimplified: Geometry = geometry

  for (let attempts = 0; attempts < maxAttempts; attempts += 1) {
    try {
      const simplified = turfSimplify(geometry, {
        tolerance,
        highQuality: true
      }) as Geometry

      const simplifiedCount = getCoordinateCount(simplified)
      const isPolygonal = simplified.type === 'Polygon' || simplified.type === 'MultiPolygon'
      const normalized = isPolygonal ? normalizePolygonWinding(simplified) : simplified

      lastSimplified = normalized

      if (simplifiedCount <= MAX_POLYGON_SIZE) {
        return normalized
      }

      if (simplifiedCount === previousCount) {
        return normalized
      }

      previousCount = simplifiedCount
      tolerance += toleranceStep
    } catch {
      return geometry
    }
  }

  return lastSimplified
}

export default simplifySpatialGeometry
