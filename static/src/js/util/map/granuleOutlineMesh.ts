import { MultiPolygon } from 'ol/geom'
import { multiPolygon, tesselate } from '@turf/turf'

// Each non-indexed vertex is [highX, highY, lowX, lowY, offsetX, offsetY].
// Keep the CPU packer, byte stride, attribute offsets and vertex shader in sync.
// Attribute offsets count floats; vertexAttribPointer needs those offsets in bytes.
export const VERTEX_FLOATS = 6
export const VERTEX_STRIDE = VERTEX_FLOATS * Float32Array.BYTES_PER_ELEMENT
export const VERTEX_ATTRIBUTES = [
  {
    componentCount: 2,
    floatOffset: 0,
    name: 'positionHigh'
  },
  {
    componentCount: 2,
    floatOffset: 2,
    name: 'positionLow'
  },
  {
    componentCount: 2,
    floatOffset: 4,
    name: 'strokeOffset'
  }
] as const

const CANVAS_MITER_LIMIT = 10
const COLLINEAR_TOLERANCE = 1e-12
// Build offsets once at unit width; the shader applies the current pixel width.
const UNIT_STROKE_WIDTH = 1

/** XY pair in map coordinates; stroke construction uses the same plane for offsets. */
type Point = [number, number]
/** Emit an expanded vertex with its unexpanded ring anchor, separating position from stroke offset. */
type EmitVertex = (point: Point, anchor: Point) => void
/** Emit one stroke triangle with an unexpanded ring anchor corresponding to each vertex. */
type EmitTriangle = (a: Point, b: Point, c: Point, anchors: [Point, Point, Point]) => void

/** CPU mesh cached by geometry identity/revision; contains no camera or GPU-owned state. */
interface GeometryMesh {
  /** Interior triangle vertex count (not floats); holes contain no triangles. */
  fillCount: number
  /** OpenLayers geometry revision used to reject stale coordinates after mutation. */
  revision: number
  /** Stroke triangle vertex count; the interior range starts immediately after it. */
  strokeCount: number
  /** Interleaved six-float vertices: all stroke triangles, followed by interior triangles. */
  vertices: Float32Array
}

const samePoint = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1]

const getStrokeRingPoints = (ring: Point[]): Point[] => {
  // Consecutive duplicates create zero-length segments with no stroke.
  const points = ring.filter((point, index) => index === 0 || !samePoint(point, ring[index - 1]))
  // Segment iteration wraps to the first point, so omit the closing duplicate.
  if (points.length > 1 && samePoint(points[0], points[points.length - 1])) points.pop()

  return points
}

const getLeftNormal = (start: Point, end: Point): Point => {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const length = Math.hypot(dx, dy)

  return [-dy / length, dx / length]
}

const offsetPoint = (point: Point, direction: Point, distance: number): Point => [
  point[0] + direction[0] * distance,
  point[1] + direction[1] * distance
]

const emitSegmentRectangle = (
  start: Point,
  end: Point,
  normal: Point,
  halfWidth: number,
  emitTriangle: EmitTriangle
) => {
  const startLeft = offsetPoint(start, normal, halfWidth)
  const startRight = offsetPoint(start, normal, -halfWidth)
  const endLeft = offsetPoint(end, normal, halfWidth)
  const endRight = offsetPoint(end, normal, -halfWidth)
  emitTriangle(startLeft, startRight, endLeft, [start, start, end])
  emitTriangle(startRight, endRight, endLeft, [start, end, end])
}

const emitCornerJoin = (
  corner: Point,
  previousNormal: Point,
  nextNormal: Point,
  halfWidth: number,
  emitTriangle: EmitTriangle
) => {
  const turn = previousNormal[0] * nextNormal[1] - previousNormal[1] * nextNormal[0]
  if (Math.abs(turn) < COLLINEAR_TOLERANCE) return

  const outerSide = turn > 0 ? -1 : 1
  const previousEdge: Point = [
    corner[0] + previousNormal[0] * halfWidth * outerSide,
    corner[1] + previousNormal[1] * halfWidth * outerSide
  ]
  const nextEdge: Point = [
    corner[0] + nextNormal[0] * halfWidth * outerSide,
    corner[1] + nextNormal[1] * halfWidth * outerSide
  ]

  // The intersection of the offset edges lies along the sum of their normals.
  // Opposing normals make this denominator zero, requiring a bevel instead.
  const miterDenominator = 1
    + previousNormal[0] * nextNormal[0]
    + previousNormal[1] * nextNormal[1]
  const miterOffsetX = (
    (previousNormal[0] + nextNormal[0]) * halfWidth * outerSide
  ) / miterDenominator
  const miterOffsetY = (
    (previousNormal[1] + nextNormal[1]) * halfWidth * outerSide
  ) / miterDenominator
  const needsBevel = !Number.isFinite(miterOffsetX)
    || !Number.isFinite(miterOffsetY)
    || Math.hypot(miterOffsetX, miterOffsetY) > halfWidth * CANVAS_MITER_LIMIT
  const anchors: [Point, Point, Point] = [corner, corner, corner]

  // Match Canvas's default miter limit so acute corners do not grow long spikes.
  if (needsBevel) {
    emitTriangle(corner, previousEdge, nextEdge, anchors)

    return
  }

  const miter: Point = [corner[0] + miterOffsetX, corner[1] + miterOffsetY]
  emitTriangle(corner, previousEdge, miter, anchors)
  emitTriangle(corner, miter, nextEdge, anchors)
}

// Triangulate each polygon part, respecting its exterior and hole rings. These
// are coverage triangles, not a visible fill. Holes and gaps between disjoint
// parts stay empty so they do not hide the outlines of later granules.
export const fillTriangles = (geometry: MultiPolygon): number[] => (
  tesselate(multiPolygon(geometry.getCoordinates())).features
    .flatMap((feature) => feature.geometry.coordinates[0].slice(0, 3).flat())
)

export const strokeTriangles = (
  ring: Point[],
  width: number,
  emitVertex?: EmitVertex
): number[] => {
  const points = getStrokeRingPoints(ring)
  if (points.length < 2) return []

  const triangles: number[] = []
  const halfWidth = width / 2
  const emitTriangle: EmitTriangle = (a, b, c, anchors) => {
    if (emitVertex) {
      emitVertex(a, anchors[0])
      emitVertex(b, anchors[1])
      emitVertex(c, anchors[2])
    } else {
      triangles.push(...a, ...b, ...c)
    }
  }

  // WebGL line widths vary by driver, so represent strokes as rectangles
  // (two triangles per segment) plus explicit corner joins. Include hole rings:
  // they have visible outlines even though their interiors remain unmasked.
  const segmentNormals = points.map((start, index) => (
    getLeftNormal(start, points[(index + 1) % points.length])
  ))

  points.forEach((start, index) => {
    const end = points[(index + 1) % points.length]
    emitSegmentRectangle(start, end, segmentNormals[index], halfWidth, emitTriangle)
  })

  points.forEach((corner, index) => {
    const previousNormal = segmentNormals[(index + points.length - 1) % points.length]
    const nextNormal = segmentNormals[index]
    emitCornerJoin(corner, previousNormal, nextNormal, halfWidth, emitTriangle)
  })

  return triangles
}

// Weak keys let removed OpenLayers geometries and their CPU meshes be collected.
// Pan/zoom does not change geometry revisions, so it never retriangulates shapes.
const meshesByGeometry = new WeakMap<MultiPolygon, GeometryMesh>()

export const geometryMesh = (geometry: MultiPolygon): GeometryMesh => {
  const revision = geometry.getRevision()
  const cachedMesh = meshesByGeometry.get(geometry)
  if (cachedMesh?.revision === revision) return cachedMesh

  const packedVertices: number[] = []
  const appendPackedVertex: EmitVertex = (point, anchor) => {
    // WebGL uses Float32. A high part plus its rounding remainder preserves map
    // precision when the shader subtracts the camera center before combining.
    const highX = Math.fround(anchor[0])
    const highY = Math.fround(anchor[1])
    packedVertices.push(
      highX,
      highY,
      anchor[0] - highX,
      anchor[1] - highY,
      point[0] - anchor[0],
      point[1] - anchor[1]
    )
  }

  // Store strokes first and interiors second: the renderer draws each range in
  // a separate pass. Unit-width offsets let zoom and style changes reuse meshes.
  geometry.getCoordinates().flat().forEach((ring) => {
    strokeTriangles(ring as Point[], UNIT_STROKE_WIDTH, appendPackedVertex)
  })

  const strokeCount = packedVertices.length / VERTEX_FLOATS

  const interiorVertices = fillTriangles(geometry)
  for (let index = 0; index < interiorVertices.length; index += 2) {
    const point: Point = [interiorVertices[index], interiorVertices[index + 1]]
    appendPackedVertex(point, point)
  }

  const mesh = {
    fillCount: interiorVertices.length / 2,
    revision,
    strokeCount,
    vertices: new Float32Array(packedVertices)
  }
  meshesByGeometry.set(geometry, mesh)

  return mesh
}
