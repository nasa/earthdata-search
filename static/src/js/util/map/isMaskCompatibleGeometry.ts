import { Geometry, MultiPolygon } from 'ol/geom'
import {
  booleanClockwise,
  booleanContains,
  booleanDisjoint,
  kinks,
  polygon
} from '@turf/turf'

// Bound the one-time validation work for pathological footprints
const MAX_RING_VERTICES = 512
const MAX_GEOMETRY_VERTICES = 1024

/** Cached validation result; validity ends when OpenLayers reports a geometry change. */
interface GeometryCompatibility {
  /** Whether normalized rings can reproduce Canvas's inverse nonzero clip with a stencil union. */
  compatible: boolean
  /** Geometry revision examined; camera/style changes do not invalidate this check. */
  revision: number
}

const compatibleGeometries = new WeakMap<Geometry, GeometryCompatibility>()

/** Explicitly closed XY ring in map coordinates, including its repeated final point. */
type Ring = number[][]

const isValidRing = (ring: Ring) => {
  if (ring.length < 4 || ring.length > MAX_RING_VERTICES) return false
  if (ring.some((point) => !point.every(Number.isFinite))) return false

  // Rings must be explicitly closed
  const first = ring[0]
  const last = ring[ring.length - 1]

  return first[0] === last[0] && first[1] === last[1]
}

// Counterclockwise exterior, clockwise holes inside it, holes not touching each other
const isNormalizedPolygon = (rings: Ring[]) => {
  if (!rings.length) return false

  const [exterior, ...holes] = rings
  if (!isValidRing(exterior) || booleanClockwise(exterior)) return false

  const exteriorShape = polygon([exterior])
  const holesValid = holes.every((hole, holeIndex) => {
    if (!isValidRing(hole) || !booleanClockwise(hole)) return false

    const holeShape = polygon([hole])
    if (!booleanContains(exteriorShape, holeShape)) return false

    return holes.slice(holeIndex + 1).every((other) => (
      booleanDisjoint(holeShape, polygon([other]))
    ))
  })

  return holesValid && kinks(polygon(rings)).features.length === 0
}

// The Canvas painter clips each granule out with an inverse nonzero path. That
// equals a simple coverage mask only for normalized, non-overlapping polygons,
// so only those use the GPU painter. Cached by geometry revision.
// "Non-overlapping" applies to parts within ONE granule: separate granules may
// overlap and are handled by painter order. Reject unusual winding, touching or
// intersecting parts/holes rather than silently changing Canvas's clip semantics.
const isMaskCompatibleGeometry = (geometry: Geometry): geometry is MultiPolygon => {
  if (geometry.getType() !== 'MultiPolygon') return false

  const revision = geometry.getRevision()
  const cached = compatibleGeometries.get(geometry)
  if (cached?.revision === revision) return cached.compatible

  const coordinates = (geometry as MultiPolygon).getCoordinates()
  let compatible = false
  try {
    const vertexCount = coordinates.flat().reduce((total, ring) => total + ring.length, 0)

    compatible = vertexCount <= MAX_GEOMETRY_VERTICES
      && coordinates.every((rings, polygonIndex) => (
        isNormalizedPolygon(rings)
        && coordinates.slice(polygonIndex + 1).every((other) => (
          booleanDisjoint(polygon(rings), polygon(other))
        ))
      ))
  } catch {
    // Malformed metadata must fall back rather than interrupting map rendering
    compatible = false
  }

  compatibleGeometries.set(geometry, {
    compatible,
    revision
  })

  return compatible
}

export default isMaskCompatibleGeometry
